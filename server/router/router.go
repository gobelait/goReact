package router

import (
	"github.com/gobelait/goReact/middleware"

	"github.com/gorilla/mux"
)

func Router() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/task", middleware.GetAllTasks).Methods("GET")
	router.HandleFunc("/api/task", middleware.CreateTasks).Methods("POST")
	router.HandleFunc("/api/task/{id}", middleware.UpdateTask).Methods("PUT")
	router.HandleFunc("/api/undoTask/{id}", middleware.UndoTask).Methods("PUT")
	router.HandleFunc("/api/redoTask/{id}", middleware.RedoTask).Methods("PUT")
	router.HandleFunc("/api/deleteTask/{id}", middleware.DeleteTask).Methods("DELETE")
	router.HandleFunc("/api/deleteAllTasks", middleware.DeleteAllTasks).Methods("DELETE")

	return router
}
