import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { Model } from './Model/model'
import { TableView } from './View/tableView'

const model = new Model();
const container = document.querySelector(".container");
const dataRender = new TableView(model.gridData,model.columns,container);
dataRender.init();