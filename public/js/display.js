function displaySchedule(data) {
    // make the headers
    const daysOfWeek = {
        Su: "Sunday",
        M: "Monday",
        T: "Tuesday",
        W: "Wednesday",
        Th: "Thursday",
        F: "Friday",
        Sa: "Saturday"
    };
      
    var table = document.getElementById('dataView')
    table.textContent = '' // clear the table
      
    // create the weekday headers
    var row = table.insertRow(-1);
    Object.keys(daysOfWeek).forEach(key => {
        var headerCell = document.createElement("th");
        headerCell.innerHTML = daysOfWeek[key]
        headerCell.name = key
        headerCell.className = "displayHeader"
        row.appendChild(headerCell) 
    });

    // organize by day / time
    const schedule = {
        Su: [],
        M: [],
        T: [],
        W: [],
        Th: [],
        F: [],
        Sa: []
      };
      
      
      // organize the data by time and day
    for(obj of data) {
        Object.values(obj.Days).forEach( day => {

            // compare the times and then organize
            let i = 0
            const start1 = new Date('1970-01-01T' + obj.StartTime + ":00")
            for(obj2 of schedule[day]) {
                const start2 = new Date('1970-01-01T' + obj2.StartTime + ":00")
                if(start1 - start2 < 0) {
                    break;
                }
                i++
            }
            const temp = schedule[day].slice(0, i)
            temp.push(obj)
            for(el of schedule[day].slice(i)) {
                temp.push(el)
            }
            schedule[day] = temp
        });
    }

    let day = 0
    Object.values(schedule).forEach( classes => {
        let row = 1
        let r
        for(c of classes) {
            if(table.rows.length <= row) {
                r = table.insertRow(-1)
                Object.values(schedule).forEach(_ => r.insertCell(-1))
            }
            table.rows[row].cells[day].appendChild(classDisplay(c))
            row++
        }
        day++;
    })

    // console.log(schedule)
}

// display a singular class cell
function classDisplay(classObj, showDay=false) {
    const box = document.createElement('div');
    box.className = 'classDisplay'
    
    const add = (tag, inner) => {
        if(inner === "") {
            box.appendChild(document.createElement('br'))
            return box
        }
        const el = document.createElement(tag)
        el.innerHTML = inner
        box.appendChild(el)
    }
    
    add('h2', classObj.Name)
    add('p', classObj.Code)
    add('p', classObj.StartTime + " - " + classObj.EndTime)
    if(showDay) {
        add('p', Object.values(classObj.Days).toString())
    }
    add('p', classObj.Length + ` hour${classObj.Length === 1 ? '' : 's'}`)

    return box
}

const showClass = () => {
    const data = document.getElementById("classSelect").value
    const display = document.getElementById("singleClassDisplay")
    display.innerText = ""
    
    // re-add the legend
    const legend = document.createElement('legend')
    legend.innerHTML = "Class to Remove"
    display.appendChild(legend)

    if(typeof data === "undefined" || data === "") {
        display.appendChild(document.createElement('br'))
        let temp1 = document.createElement('p')
        temp1.innerHTML = 'No Class'
        display.appendChild(temp1) 
        let temp2 = document.createElement('p')
        temp2.innerHTML = 'Selected'
        display.appendChild(temp2) 
        display.appendChild(document.createElement('br')) 
    } else {
        display.appendChild(classDisplay(JSON.parse(data), true))
    }

}