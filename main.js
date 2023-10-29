import './style.css'
import { Model } from './Model/model'
import { TableView } from './View/tableView'

const model = new Model();
const container = document.querySelector(".container");
const dataRender = new TableView(model.gridData,model.columns,container);
dataRender.init();