package com.olleb;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
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

    @ConfigProperty(name = "app.message.checkout.interval", defaultValue = "5")
    int messagingInterval;

    @ConfigProperty(name = "app.message.initial.interval", defaultValue = "1")
    int messagingInitialInterval;

    @ConfigProperty(name = "app.events.same.enabled", defaultValue = "true")
    boolean eventsSame;

    private static final int MAX_CHECKOUT_ITEMS = 3;

    private static final List<Product> products = List.of(
            new Product.Builder().withName("LED Desk Lamp").withQuantity(10).withPrice(12.5).build(),
            new Product.Builder().withName("Book").withQuantity(20).withPrice(5.75).build(),
            new Product.Builder().withName("Bottle").withQuantity(15).withPrice(1.25).build(),
            new Product.Builder().withName("Car Keys").withQuantity(5).withPrice(25.0).build(),
            new Product.Builder().withName("Apples").withQuantity(30).withPrice(1).build(),
            new Product.Builder().withName("Glass").withQuantity(25).withPrice(8.5).build());

    private List<Product> checkoutList = Collections.emptyList();

    @Outgoing("checkout")
    public Multi<List<Product>> updateInventory() {
        return Multi.createFrom().ticks().every(Duration.ofSeconds(messagingInterval))
                .onOverflow().drop()
                .map(p -> {
                    if (eventsSame) {
                        return selectAndDecreaseQuantities();
                    } else {
                        return randomizeQuantities();
                    }
                });
    }

    @Outgoing("inventory")
    public Multi<List<Product>> initialInventory() {
        return Multi.createFrom().ticks().every(Duration.ofSeconds(messagingInitialInterval))
                .onOverflow().drop()
                .map(p -> {
                    return products;
                });

    }

    private List<Product> selectAndDecreaseQuantities() {
        if (!checkoutList.isEmpty()) {
            return checkoutList;
        }

        checkoutList = new ArrayList<>(MAX_CHECKOUT_ITEMS);

        List<Product> shuffledProducts = new ArrayList<>(products);
        Collections.shuffle(shuffledProducts);

        for (int i = 0; i < MAX_CHECKOUT_ITEMS && i < shuffledProducts.size(); i++) {
            Product originalProduct = shuffledProducts.get(i);
            int originalQuantity = originalProduct.getQuantity();
            int decreaseAmount = random.nextInt(originalQuantity + 1);

            Product modifiedProduct = new Product.Builder()
                    .withName(originalProduct.getName())
                    .withQuantity(originalQuantity - decreaseAmount)
                    .build();

            checkoutList.add(modifiedProduct);
        }

        return checkoutList;
    }

    private List<Product> randomizeQuantities() {
        List<Product> list = new LinkedList<>();

        for (Product product : products) {
            int originalQuantity = product.getQuantity();
            int randomizedQuantity = random.nextInt(originalQuantity + 1);

            list.add(new Product.Builder().withName(product.getName()).withQuantity(randomizedQuantity).build());
        }
        return list;
    }

}
