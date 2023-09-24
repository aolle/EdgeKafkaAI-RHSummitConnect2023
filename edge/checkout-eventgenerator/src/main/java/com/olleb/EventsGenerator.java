package com.olleb;

import java.time.Duration;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import org.eclipse.microprofile.reactive.messaging.Outgoing;

import com.olleb.model.Product;

import io.smallrye.mutiny.Multi;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EventsGenerator {

    private static final Random random = new Random();

    private boolean initialInventoryEmitted = false;

    private static final List<Product> products = List.of(
            new Product.Builder().withName("LED Desk Lamp").withQuantity(10).build(),
            new Product.Builder().withName("Book").withQuantity(20).build(),
            new Product.Builder().withName("Bottle").withQuantity(15).build(),
            new Product.Builder().withName("Car Keys").withQuantity(5).build(),
            new Product.Builder().withName("Apples").withQuantity(30).build(),
            new Product.Builder().withName("Glass").withQuantity(25).build());

    @Outgoing("inventory-channel")
    public Multi<List<Product>> generateInventory() {

        return Multi.createFrom().ticks().every(Duration.ofSeconds(20))
                .onOverflow().drop()
                .map(p -> {
                    if (!initialInventoryEmitted) {
                        initialInventoryEmitted = true;
                        return products;
                    } else {
                        return randomizeQuantities();
                    }

                });

    }

    // @Outgoing("inventory-channel")
    // public Uni<List<Product>> initialInventory() {
    // return Uni.createFrom()
    // .item(() -> {
    // return products;
    // });
    // }

    private static List<Product> randomizeQuantities() {
        List<Product> list = new LinkedList<>();

        for (Product product : products) {
            int originalQuantity = product.getQuantity();
            int randomizedQuantity = random.nextInt(originalQuantity + 1);

            product.setQuantity(randomizedQuantity);
            list.add(product);
        }
        return list;
    }

}
