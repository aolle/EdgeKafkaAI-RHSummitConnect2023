package com.olleb.model;

public class Product {

    private static Long currentId = 1L;
    private Long id;
    private String name;

    private int quantity;
    private double price;
    private String image;

    private Product(Builder builder) {
        this.id = currentId++;
        this.name = builder.name;
        this.quantity = builder.quantity;
        this.price = builder.price;
        this.image = builder.image;
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

    public double getPrice() {
        return price;
    }

    public String getImage() {
        return image;
    }

    public Long getId() {
        return id;
    }

    public static class Builder {
        private String name;
        private int quantity = 1;
        private double price = .0;
        private String image = "";

        public Builder withName(String name) {
            this.name = name;
            return this;
        }

        public Builder withQuantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder withPrice(double price) {
            this.price = price;
            return this;
        }

        public Builder withImage(String image) {
            this.image = image;
            return this;
        }

        public Product build() {
            return new Product(this);
        }
    }

}
