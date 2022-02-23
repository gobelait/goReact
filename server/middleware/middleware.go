package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/gobelait/goReact/db"
	"github.com/gobelait/goReact/models"
)

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	playload := getAllTasks()
	json.NewEncoder(w).Encode(playload)
}

func CreateTasks(w http.ResponseWriter, r *http.Request) {
	fmt.Println("creating task")
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var task models.TodoList
	json.NewDecoder(r.Body).Decode(&task)
	insertOneTask(task)
	json.NewEncoder(w).Encode(task)
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	fmt.Println("updating task")
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// trouver un moyen de passer les infos dans le r.Body
	var updatedTask models.TodoList
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&updatedTask); err != nil {
		log.Fatal("erreur decode Body : ", w)
	}
	defer r.Body.Close()

	param_id := mux.Vars(r)["id"]
	id, err := primitive.ObjectIDFromHex(param_id)
	if err != nil {
		log.Fatal("erreur transformation ObjectID", err, id)
	}
	updatedTask.ID = id
	updateTask(updatedTask)

}

func UndoTask(w http.ResponseWriter, r *http.Request) {
	fmt.Println("undoing task")
	w.Header().Set("Content-Type", "application-x-www-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	undoTask(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

func RedoTask(w http.ResponseWriter, r *http.Request) {
	fmt.Println("redoing task")
	w.Header().Set("Content-Type", "application-x-www-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)

	redoTask(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	fmt.Println("deleting task")
	w.Header().Set("Content-Type", "application-x-www-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	deleteOneTask(params["id"])
}

func DeleteAllTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application-x-www-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	count := deleteAllTasks()
	json.NewEncoder(w).Encode(count)
}

func getAllTasks() []primitive.M {
	cur, err := db.GetMongoDBCollection().Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal("getAlltask err : ", err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	cur.Close(context.Background())
	return results
}

func updateTask(taskUpdate models.TodoList) {
	fmt.Println("update : ", taskUpdate.Task)
	filter := bson.M{"_id": taskUpdate.ID}
	update := bson.M{"$set": bson.M{"task": taskUpdate.Task}}
	result, err := db.GetMongoDBCollection().UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("modified count: ", result.ModifiedCount)
}

func insertOneTask(task models.TodoList) {
	insertResult, err := db.GetMongoDBCollection().InsertOne(context.Background(), task)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("added task : ", insertResult.InsertedID)
}

func undoTask(task string) {
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": true}}
	result, err := db.GetMongoDBCollection().UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("modified count: ", result.ModifiedCount)
}

func redoTask(task string) {
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": false}}
	result, err := db.GetMongoDBCollection().UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("modified count: ", result.ModifiedCount)
}

func deleteOneTask(task string) {
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	d, err := db.GetMongoDBCollection().DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("deleted task : ", d.DeletedCount)
}

func deleteAllTasks() int64 {
	d, err := db.GetMongoDBCollection().DeleteMany(context.Background(), bson.D{})
	if err != nil {
		log.Fatal("erreur delete all : ", err)
	}

	fmt.Println("deleted task : ", d.DeletedCount)
	return d.DeletedCount
}
