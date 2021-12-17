// Select color input
const color_selector = document.querySelector('#colorPicker');
let color_value = color_selector.value;

const submit_btn = document.querySelector('#submit');
const table_canvas = document.querySelector('#pixelCanvas');
const save_pixelart_btn = document.querySelector('#save-pixelart');
const save_pixelart_json = document.querySelector('#save-pixelart-json');
const upload_pixelart = document.querySelector('#upload-pixelart');

//Download pixelart as json
save_pixelart_json.addEventListener('click', () => {
    let pixelart = returnPixelArt();
    save_pixelart_json.setAttribute('href', pixelart);
    save_pixelart_json.setAttribute('download', 'pixelart.json')
})

//Upload pixelart
upload_pixelart.addEventListener('change', (event) => {
    uploadPixelArt();
})

// When size is submitted by the user, call makeGrid()
submit_btn.addEventListener('click', (e) => {
    e.preventDefault();
    makeGrid();
});

// Save Pixelart
save_pixelart_btn.addEventListener('click', () => {
    savePixelArt(true, false);
    updatePixelartList();
})

//Set mouse status
let mouse_status = "";
document.body.addEventListener('mousedown', () => {
    mouse_status = 'down';
})

document.body.addEventListener('mouseup', () => {
    mouse_status = 'up';
})

//Fill saved pixelart when the page load
    updatePixelartList(); 
    
    function updatePixelartList()
    {
        const pixelart_list = document.querySelector('#saved-pixelart-list');
        pixelart_list.innerHTML = null;

        for (let i = 0; i < localStorage.length; i++) {
            const li = document.createElement('li');
            const a_element = document.createElement('a');
            const remove_a_element = document.createElement('a');

            if (localStorage.key(i).startsWith("pixelart")) {
                a_element.setAttribute('href', '#')
                a_element.setAttribute('id', `${i}`);
                a_element.setAttribute('onclick', 'getPixelArt(this.innerHTML);')
                a_element.setAttribute('class', 'pixelart');
                a_element.innerHTML = `${localStorage.key(i)}`;
                remove_a_element.setAttribute('href', '#');
                remove_a_element.setAttribute('onclick', 'removePixelart(this)');
                remove_a_element.innerHTML = " verwijder pixelart"
                li.appendChild(a_element);
                li.appendChild(remove_a_element)
                pixelart_list.appendChild(li)
            }
        }
    }

let getPixelArtStatus = false;

function makeGrid(saved_pixelart)
{
    table_canvas.innerHTML = "";

    let grid_height;
    let grid_width;
    if (saved_pixelart == null)
    {
        // Select size input
        grid_height = document.querySelector('#inputHeight').value;
        grid_width = document.querySelector('#inputWeight').value;
    }
    else
    {
        grid_height = saved_pixelart[0];
        grid_width = saved_pixelart[1];
        getPixelArtStatus = true;
    }

    let row;

    for (let i = 0; i < grid_height; i++)
    {
        // Create element
        const row_element = document.createElement('tr');
        row_element.setAttribute("id", `${i}`);
        row = table_canvas.appendChild(row_element);
        
        for (let j = 0; j < grid_width; j++)
        {
            // Create element
            const cel_element = document.createElement('td');
            cel_element.setAttribute("onmouseover", `fillCanvas(this, getColorValue())`);
            cel_element.setAttribute("onclick", `fillCanvas(this, getColorValue(), true)`);
            cel_element.setAttribute("user-select", "none");

            if (getPixelArtStatus == true)
            {
                if (saved_pixelart[i + 2][j] != null)
                {
                    if (saved_pixelart[i + 2][j].includes("background"))
                    {
                        cel_element.setAttribute("style", `${saved_pixelart[i + 2][j]}`)
                    }
                }
            }
            row.appendChild(cel_element);
        }
    }
    getPixelArtStatus = false;
}

function fillCanvas(element, color, click = false)
{
    if (mouse_status == 'down' && click == false)
    {
        element.style.backgroundColor = color;
    }
    else if(click == true)
    {
        element.style.backgroundColor = color;
    }
}

function getColorValue()
{
    color_value = color_selector.value;
    return color_value;
}

function savePixelArt(save_local = false, save_json = false)
{
    // Select size input
    let grid_height = document.querySelector('#inputHeight').value;
    let grid_width = document.querySelector('#inputWeight').value;

    let table_data = [];
    table_canvas.childNodes.forEach(element => {
        table_data.push({table_data: element})
    });
    const obj = Object.assign({}, table_data);
    let obj_length = obj[0].table_data.childNodes.length;
    
    let pixelart_data = [];
    let background_color = [];

    for (let i in obj)
    {
        background_color = [];
        for (let j = 0; j < obj_length; j++)
        {
            background_color.push(obj[i].table_data.childNodes[j].getAttribute("style"));
        }
        pixelart_data.push(background_color);
    }

    pixelart_data.unshift(grid_width);
    pixelart_data.unshift(grid_height);
    let pixelart_counter = 1;

    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("pixelart"))
        {
            pixelart_counter++
        }
    }

    if (save_local == true)
    {
        localStorage.setItem(`pixelart${pixelart_counter}`, JSON.stringify(pixelart_data))
    }
    else
    {
        const json_file = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pixelart_data));
        return json_file;
    }
}

function uploadPixelArt()
{
    let grid_height = document.querySelector('#inputHeight');
    let grid_width = document.querySelector('#inputWeight');

    if (upload_pixelart.files.length > 0)
    {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            const result = JSON.parse(reader.result)
            grid_height.value = result[0];
            grid_width.value = result[1];
            makeGrid(result)

        })
            return reader.readAsText(upload_pixelart.files[0])
    }
}

function returnPixelArt()
{
    return savePixelArt(false, true);
}

function getPixelArt(element)
{
    // Select size input
    let grid_height = document.querySelector('#inputHeight');
    let grid_width = document.querySelector('#inputWeight');
    let saved_pixelart = JSON.parse(localStorage.getItem(element));

    grid_height.value = saved_pixelart[0];
    grid_width.value = saved_pixelart[1];

    makeGrid(saved_pixelart)
}

function removePixelart(element)
{
    let pixelart_name = element.parentElement.childNodes[0].innerHTML;
    localStorage.removeItem(pixelart_name);
    element.parentElement.remove();
}
