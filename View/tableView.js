export class TableView{
    constructor(gridData,columns,container){
        console.log(container);
        this.gridData = gridData;
        this.coulms= columns;
        this.container = container;
        this.tableDiv = document.createElement('div');
        this.table = document.createElement("table");
        this.tableDiv.className = "tableContainer";
        this.searchInput = document.querySelector("input");

        this.tableDiv.append(this.table)
        this.container.appendChild(this.tableDiv);
        this.tableBody = document.createElement("tbody");
        this. tableHeadRender(this.coulms);
        this.tableDataRender(this.tableBody,this.gridData,0);
        this.pagination = document.querySelector('.pagination');
        this.total_records = this.gridData.length;
        this.record_per_page = 5;
        this.page_number = 1;
        this.total_page = Math.ceil(this.total_records / this.record_per_page);
        this.recordsPerPage();
        this.generatePage(this.total_page);
        this. displayRecords(5)
    }

    init(){
        this.eventOnSearch(this.tableBody,this.gridData);
        this.eventForSorting(this.tableBody);
        this.eventOnaddRow();
    }

    tableHeadRender(coulms){
        const tableHead = document.createElement("thead");
        const tableRow = document.createElement("tr");
        const tableheadData = coulms.map((item) => `<th>${item.title}</th>`).join("");
        tableRow.innerHTML = tableheadData;
        tableHead.appendChild(tableRow);
        this.table.appendChild(tableHead)
    }

    tableDataRender(tableBody,gridData,start_index){
        gridData.forEach((item,index) => {        
            const tableRow = document.createElement("tr");
            tableRow.style.border="1px solid black";
            tableRow.innerHTML += `<td >${index+1+start_index}</td>`;
           
            item.forEach((items) => {
                tableRow.innerHTML += `<td>${items}</td>`
            });

            tableRow.innerHTML += 
            `
                <td>
                    <button class="edit-button">
                        <i class="fa fa-pencil" style="font-size: 20px; color: blue;"></i>
                    </button>
                    <button class="save-button" style = "display: none">
                        <i class="fa fa-check" style="font-size: 20px; color: blue;"></i>
                    </button>                       
                </td>
                <td>
                    <i class="fa fa-trash-o  deleteRow" style="font-size: 20px; color: red;"></i>
                </td>
            `;
            this.createDeleteIcon(tableBody,tableRow, index,gridData)                        
            tableBody.appendChild(tableRow);
        });
        
        this.table.appendChild(tableBody);
        this.eventOnEditMode();
        this.eventOnSaveChanges(tableBody,gridData);       
    }

    createDeleteIcon(tableBody,tableRow,rowIndex,gridData) {
        const deleteIcon = tableRow.querySelector(".deleteRow")  
        deleteIcon.addEventListener("click", ()=> {
            tableRow.remove();
            
            if (rowIndex >= 0 && rowIndex < gridData.length) {
                this.gridData.splice(rowIndex, 1);
                this.total_records--;
                const totalPages = Math.ceil(this.total_records / this.record_per_page);
                if (this.page_number > totalPages) {
                    this.page_number = totalPages;
                }
                this.total_page = Math.ceil(this.total_records / this.record_per_page);
                tableBody.innerHTML = "";
        
                this.displayRecords(this.record_per_page);
                this.generatePage(this.total_page);
            }
        });
    }

    handleSearch(tableBody,gridData) {
        const query = this.searchInput.value.toLowerCase().trim();
        if(query === ""){           
            alert("Please write something");
            return;
        } else {
            tableBody.innerHTML = "";
            const filteredData = gridData.filter( (item)=> {
                for (var i = 0; i < item.length; i++) {
                    if (item[i].toLowerCase().trim().includes(query)) {
                        return true;
                    }
                }
            });
            console.log(filteredData)
            if (filteredData.length > 0) {
                this.tableDataRender(tableBody,filteredData);
                return;
            } else {
                alert("no data found");
                this.tableDataRender(tableBody,this.gridData);
                return;
            }
        }
    }
    
    eventOnSearch(tableBody,gridData){
        this.searchInput.addEventListener("keyup", (event) =>{
            this.handleSearch(tableBody,gridData);
        });
    }

    handleSort(sortOrder,sortedColumnIndex ,columnIndex,tableBody) {
        if (sortedColumnIndex === columnIndex) {
            sortOrder *= -1; 
        } else {
            sortOrder = 1; 
        }
        sortedColumnIndex = columnIndex;
        const sortedData = this.gridData.slice().sort((a, b) => {
            const valueA = a[columnIndex];
            const valueB = b[columnIndex];
            if (valueA < valueB) {
                return -1 * sortOrder;
            }
            if (valueA > valueB) {
                return 1 * sortOrder;
            }
            return 0;
        });
        tableBody.innerHTML = "";
        this.tableDataRender(tableBody,sortedData);
    }
    
    eventForSorting(tableBody){
        const th = document.querySelectorAll("th");
        th.forEach((item,index) =>{
            let sortedColumnIndex = -1;
            let sortOrder = 1;
            item.addEventListener("click",(event)=>{
                this.handleSort(sortOrder,sortedColumnIndex,index-1,tableBody) 
            })
        })
    }
    
    editModeOn(row){
        const cells = row.querySelectorAll("td");
        for(let i = 1; i< cells.length-2; i ++){
            const cell = cells[i];
            cell.contentEditable = true;
            cell.addEventListener("input", () => {
                cell.dataset.editedValue = cell.textContent.trim();
            });
        }
    }

    eventOnEditMode(){
        const editButtons = this.table.querySelectorAll('.edit-button');
        editButtons.forEach((editButton) => {
            editButton.addEventListener('click', (event) => {
                const row = event.target.closest("tr");
                this.editModeOn(row);
                const saveButton = row.querySelector('.save-button');
                saveButton.style.display = "block";
                editButton.style.display = "none";
            });
        });
    }

    saveChanges(row){
        const cells = row.querySelectorAll("td");
        const newData = []
        for(let i = 1; i< cells.length-2; i ++){
            const cell = cells[i];
            cell.contentEditable = false;
            const editedValue = cell.dataset.editedValue || cell.textContent.trim();
            newData.push(editedValue);   
        }
        const rowIndex = row.querySelector("td:first-child").textContent - 1;
        this.gridData[rowIndex] = newData;
    }
    
    eventOnSaveChanges(tableBody,gridData){
        const saveButtons = this.table.querySelectorAll('.save-button');
        saveButtons.forEach((saveButton) => {
            saveButton.addEventListener('click', (event) => {
                const row = event.target.closest("tr");
                const editButton = row.querySelector('.edit-button');
                saveButton.style.display = "none";
                editButton.style.display = "block";
                this.saveChanges(row);
                tableBody.innerHTML= "";
                this.displayRecords(this.record_per_page);
                this.generatePage(this.total_page);
            });
        });
    }
    
    addRow(){
        const table = document.querySelector('table');
        const newRow = table.insertRow();
        let rowNumber = this.gridData.length+1;
        newRow.innerHTML = `<td>${rowNumber}</td>`;
        rowNumber++;
        for (let i = 0; i < 6; i++) {
            const cell = newRow.insertCell();
            cell.contentEditable = true;
        }
        newRow.innerHTML +=`
            <td>
                <button class="edit-button" style = "display: none">
                    <i class="fa fa-pencil" style="font-size: 20px; color: blue;"></i>
                </button>
                <button class="save-button" style = "display: block">
                    <i class="fa fa-check" style="font-size: 20px; color: blue;"></i>
                </button>                       
            </td>
            <td>
                <i class="fa fa-trash-o  deleteRow" style="font-size: 20px; color: red;"></i>
            </td>
        `;
    }
    
    eventOnaddRow(){
        const addButton = document.querySelector(".AddDetails");
        addButton.addEventListener("click",()=>{
            this.addRow();
            this.eventOnSaveChanges();
        })
    }

    displayRecords(record_per_page){
        let start_index = (this.page_number - 1) * record_per_page;
        let end_index = start_index + (record_per_page - 1);
        this.tableBody.innerHTML= "";
        let paginationData =  []
        for (let i = start_index; i <= end_index && i < this.total_rows.length; i++) {
            paginationData.push(this.gridData[i]);
        }
        this.tableDataRender(this.tableBody,paginationData,start_index)
        this.eventOnEditMode();
        this.eventOnSaveChanges();
    }
    
    generatePage(total_page) {
        this.total_page = total_page;
        let prevButton = `<li><button class="prevButton" >Previous</button></li>`;
        let nextButton = `<li><button class="nextButton">Next</button></li>`;
        let pageValue = '';
        for (let i = 1; i <= total_page; i++) {
            const activeClass = i === this.page_number ? "active" : "";
            pageValue += `<li class="pageNumber ${activeClass}" id="page${i}">${i}</li>`;
        }      
        this.pagination.innerHTML = `<ul>${prevButton}${pageValue}${nextButton}</ul>`;
        this.eventOnnextBtn(total_page);
        this. eventOnPrevBtn(total_page);
        this.addPageNumberClickEventListeners(total_page);
    }

    eventOnnextBtn(total_page){
        const nextButton = this.pagination.querySelector(".nextButton") ;
        nextButton.addEventListener("click",(event)=>{
            if (this.page_number < total_page) {
                this.page_number++;
                this.displayRecords(this.record_per_page);
                this.generatePage(total_page);
                this.displayRecords(this.record_per_page);
            }
        })
    }
    
    eventOnPrevBtn(total_page){
        const prevButton = this.pagination.querySelector(".prevButton") ;
        prevButton.addEventListener("click",(event)=>{
            if (this.page_number >1) {
                prevButton.disabled= false;
                this.page_number--;
                this.displayRecords(this.record_per_page);
            }
            if( this.page_number ===1){
                prevButton.disabled= true;
                prevButton.style.opacity = "0.1"
            }
            this.generatePage(total_page);
            this.displayRecords(this.record_per_page);
        })
    }

    recordsPerPage(){
        this.total_rows = document.querySelectorAll("tbody tr");
        this.total_records = this.total_rows.length;
        const record_size = document.getElementById("record_size");
        record_size.addEventListener('change', (e)=> {
            this.record_per_page = parseInt(record_size.value);
            this.total_page = Math.ceil(this.total_records /this.record_per_page);
            if (this.page_number > this.total_page) {
                this.page_number = this.total_page;
            }
            this.displayRecords(this.record_per_page);
            this.generatePage(this.total_page);
        })
    }

    handlePageClick(pageNumber,total_page) {
        this.page_number = pageNumber;
        this.displayRecords(this.record_per_page);
        this.generatePage(total_page);
    }
    
    addPageNumberClickEventListeners(total_page) {
        const pageNumberElements = this.pagination.querySelectorAll(".pageNumber");
        pageNumberElements.forEach((pageNumberElement) => {
            pageNumberElement.addEventListener("click", () => {
                const pageNumber = parseInt(pageNumberElement.textContent);
                this.handlePageClick(pageNumber,total_page);
            });
        });
    }
}