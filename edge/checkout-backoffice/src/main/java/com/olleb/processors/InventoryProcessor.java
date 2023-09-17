package com.olleb.processors;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;

import com.olleb.model.Product;

import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class InventoryProcessor {

    private List<Product> productList = new ArrayList<>();

    @Incoming("inventory-channel")
    public Uni<Void> processInventoryMessage(Message<List<Product>> message) {
        this.productList = message.getPayload();
        return Uni.createFrom().voidItem();
    }

    public List<Product> getProductList() {
        return productList;
    }

}
