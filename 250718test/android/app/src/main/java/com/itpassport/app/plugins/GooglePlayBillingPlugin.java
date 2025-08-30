package com.itpassport.app.plugins;

import android.app.Activity;
import com.android.billingclient.api.*;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "GooglePlayBilling")
public class GooglePlayBillingPlugin extends Plugin implements PurchasesUpdatedListener {

    private BillingClient billingClient;
    private List<String> ownedProductIds = new ArrayList<>();

    @Override
    public void load() {
        billingClient = BillingClient.newBuilder(getContext())
            .enablePendingPurchases()
            .setListener(this)
            .build();
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    call.resolve();
                } else {
                    call.reject("Billing setup failed: " + billingResult.getDebugMessage());
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // 自動再接続はBillingClientが処理
            }
        });
    }

    @PluginMethod
    public void queryPurchases(PluginCall call) {
        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.INAPP)
            .build();

        billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
            ownedProductIds.clear();
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                        for (String productId : purchase.getProducts()) {
                            ownedProductIds.add(productId);
                        }
                    }
                }
            }
            
            JSObject result = new JSObject();
            JSArray purchasedProducts = new JSArray();
            for (String productId : ownedProductIds) {
                purchasedProducts.put(productId);
            }
            result.put("purchasedProducts", purchasedProducts);
            call.resolve(result);
        });
    }

    @PluginMethod
    public void queryProductDetails(PluginCall call) {
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        
        // アプリの商品ID（Play Consoleで設定したものと一致させる）
        productList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("ad_free")
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        );
        productList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("mock_test")
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        );

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject("Failed to query product details: " + billingResult.getDebugMessage());
                return;
            }

            JSObject result = new JSObject();
            JSObject products = new JSObject();
            
            for (ProductDetails details : productDetailsList) {
                JSObject productInfo = new JSObject();
                productInfo.put("title", details.getTitle());
                productInfo.put("description", details.getDescription());
                
                ProductDetails.OneTimePurchaseOfferDetails offerDetails = details.getOneTimePurchaseOfferDetails();
                if (offerDetails != null) {
                    productInfo.put("price", offerDetails.getFormattedPrice());
                    productInfo.put("priceAmountMicros", offerDetails.getPriceAmountMicros());
                    productInfo.put("priceCurrencyCode", offerDetails.getPriceCurrencyCode());
                }
                
                products.put(details.getProductId(), productInfo);
            }
            
            result.put("products", products);
            call.resolve(result);
        });
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId");
        if (productId == null) {
            call.reject("productId is required");
            return;
        }

        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(productId)
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        );

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK || productDetailsList.isEmpty()) {
                call.reject("Product not found: " + productId);
                return;
            }

            ProductDetails productDetails = productDetailsList.get(0);
            
            List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
            productDetailsParamsList.add(
                BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)
                    .build()
            );

            BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(productDetailsParamsList)
                .build();

            Activity activity = getActivity();
            BillingResult result = billingClient.launchBillingFlow(activity, billingFlowParams);
            
            if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                call.resolve();
            } else {
                call.reject("Purchase flow failed: " + result.getDebugMessage());
            }
        });
    }

    @Override
    public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    // 購入完了処理
                    for (String productId : purchase.getProducts()) {
                        if (!ownedProductIds.contains(productId)) {
                            ownedProductIds.add(productId);
                        }
                    }

                    // 重要：購入確認（acknowledge）
                    if (!purchase.isAcknowledged()) {
                        AcknowledgePurchaseParams acknowledgePurchaseParams =
                            AcknowledgePurchaseParams.newBuilder()
                                .setPurchaseToken(purchase.getPurchaseToken())
                                .build();
                        
                        billingClient.acknowledgePurchase(acknowledgePurchaseParams, billingResult1 -> {
                            // 購入確認完了
                        });
                    }

                    // Webサイドに購入完了を通知
                    JSObject purchaseData = new JSObject();
                    JSArray products = new JSArray();
                    for (String productId : purchase.getProducts()) {
                        products.put(productId);
                    }
                    purchaseData.put("products", products);
                    notifyListeners("purchaseCompleted", purchaseData);
                }
            }
        }
    }
}