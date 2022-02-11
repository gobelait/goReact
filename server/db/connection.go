package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var userClient *mongo.Client
var collection *mongo.Collection

func ConnectMongodb() {
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)

	connectionString := os.Getenv("DB_URI")
	fmt.Println("connection string : ", connectionString)
	dbName := os.Getenv("DB_NAME")
	collName := os.Getenv("DB_COLLECTION_NAME")

	clientOptions := options.Client().ApplyURI(connectionString)

	userClient, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("erreur connect : \n", err)
	}
	err = userClient.Ping(ctx, nil)
	if err != nil {
		log.Fatal("erreur ping : \n", err)
	}
	fmt.Println("Connected to user mongodb")

	collection = userClient.Database(dbName).Collection(collName)
	fmt.Println("Instance de la collection créée")
}

func GetMongoDBClient() *mongo.Client {
	return userClient
}

func GetMongoDBCollection() *mongo.Collection {
	return collection
}
