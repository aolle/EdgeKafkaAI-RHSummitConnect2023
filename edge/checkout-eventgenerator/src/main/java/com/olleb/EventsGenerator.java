package com.olleb;

import java.time.Duration;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.reactive.messaging.Outgoing;

import com.olleb.model.Product;

import io.smallrye.mutiny.Multi;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EventsGenerator {

    private static final Random random = new Random();

    @ConfigProperty(name = "app.message.interval", defaultValue = "60")
    int messagingInterval;

    private static final List<Product> products = List.of(
            new Product.Builder().withName("LED Desk Lamp").withQuantity(10).build(),
            new Product.Builder().withName("Book").withQuantity(20).build(),
            new Product.Builder().withName("Bottle").withQuantity(15).build(),
            new Product.Builder().withName("Car Keys").withQuantity(5).build(),
            new Product.Builder().withName("Apples").withQuantity(30).build(),
            new Product.Builder().withName("Glass").withQuantity(25).build());

    @Outgoing("checkout")
    public Multi<List<Product>> updateInventory() {
        return Multi.createFrom().ticks().every(Duration.ofSeconds(messagingInterval))
                .onOverflow().drop()
                .map(p -> {
                    return randomizeQuantities();
                });

    }

    @Outgoing("inventory")
    public Multi<List<Product>> initialInventory() {
        return Multi.createFrom().ticks().every(Duration.ofSeconds(messagingInterval))
                .onOverflow().drop()
                .map(p -> {
                    return products;
                });

    }

    private static List<Product> randomizeQuantities() {
        List<Product> list = new LinkedList<>();

        for (Product product : products) {
            int originalQuantity = product.getQuantity();
            int randomizedQuantity = random.nextInt(originalQuantity + 1);

            list.add(new Product.Builder().withName(product.getName()).withQuantity(randomizedQuantity).build());
        }
        return list;
    }

}
