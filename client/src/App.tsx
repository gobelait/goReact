import React from "react";
import "./App.css";
import {Container} from "semantic-ui-react";
import TodoList from "./components/TodoList";

function App() {


  return (
    <div>
       <Container>
         <TodoList prop={undefined}></TodoList>
       </Container>
    </div>
  );
}

export default App;