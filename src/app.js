import getDomPath from "./modules/getDomPath";
import selector from "./modules/selector";

const init =(params) =>{
  selector();
  getDomPath()
};

window.init=init