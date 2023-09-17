package com.olleb.serialization;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.olleb.model.Product;

import io.quarkus.kafka.client.serialization.ObjectMapperDeserializer;

public class ListOfProductsDeserializer extends ObjectMapperDeserializer<List<Product>> {
    public ListOfProductsDeserializer() {
        super(new TypeReference<List<Product>>() {

        });
    }
}
