package com.olleb.model;

public class Product {

    private int id;
    private String name;

    private int quantity;
    private double price;
    private String image;

    private Product(int id, String name, int quantity, double price, String image) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.image = image;
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

    public int getId() {
        return id;
    }

    public static class Builder {

        private static int currentId = 1;

        private int id;
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

        public Builder withId(int id) {
            this.id = id;
            return this;
        }

        private static int generateNewId() {
            return currentId++;
        }

        public Product build() {
            if (this.id == 0) {
                this.id = generateNewId();
            }
            return new Product(id, name, quantity, price, image);

        }
    }

}
