import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./Redux/store";
import App from "./App";
import { SnackbarProvider } from "notistack";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
