package com.olleb.model;

public class Product {

    private static Long currentId = 1L;
    private Long id;
    private String name;

    private int quantity;

    private Product(Builder builder) {
        this.id = currentId++;
        this.name = builder.name;
        this.quantity = builder.quantity;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public static class Builder {
        private String name;
        private int quantity = 1;

        public Builder withName(String name) {
            this.name = name;
            return this;
        }

        public Builder withQuantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public Product build() {
            return new Product(this);
        }
    }

}
