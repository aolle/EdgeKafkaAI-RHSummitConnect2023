package com.olleb;

import java.time.Duration;
import java.util.List;

import org.eclipse.microprofile.reactive.messaging.Outgoing;

import com.olleb.model.Product;

import io.smallrye.mutiny.Multi;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EventsGenerator {

    /**
     * [
     * {
     * "name": "producto1",
     * "quantity": 1
     * },
     * {
     * "name": "producto2",
     * "quantity": 12
     * }
     * ]
     */

    private List<Product> products = List.of(
            new Product.Builder().withName("LED Desk Lamp").build(),
            new Product.Builder().withName("Book").build());

    @Outgoing("inventory-channel")
    public Multi<List<Product>> generateInventory() {
        return Multi.createFrom().ticks().every(Duration.ofSeconds(5))
                .onOverflow().drop()
                .map(p -> {
                    return products;
                });
    }

}
