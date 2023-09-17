const express = require('express'),
      app = express();

let taskList = [];
let taskId = 0;

app.use(express.static('public'));

app.get('/getTasks', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(taskList));
}); 

app.post('/submitTasks', (req, res) => {
  let dataString = '';

  req.on('data', function(data) {
    dataString += data;
  });

  req.on('end', function() {
    let info = JSON.parse(dataString);

    const currentDate = new Date();
    const objDate = new Date(info.dueDate);
    if (currentDate <= objDate) {
      const timeDifferenceInMilliseconds = objDate - currentDate;
      const daysDifference = Math.ceil(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));

      info.daysRemaining = daysDifference > 1 ? `${daysDifference} days` : "1 day";
    }
    else {
      info.daysRemaining = "Overdue";
    }
    info.taskId = taskId;
    taskId = taskId + 1;

    console.log(info);
    taskList.push(info);

    res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    res.end('Submit Success');
  });

});

app.post('/deleteTask', (req, res) => {
  let dataString = '';

  req.on( 'data', function(data) {
      dataString += data;
  })

  req.on('end', function() {
    let info = JSON.parse(dataString);
    for (let i = 0; i < taskList.length; i++) {
      if (parseInt(info.id) === taskList[i].taskId) {
        taskList.splice(i, 1);
        break;
      }
    }

    res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    res.end('Delete Success');
  })
});

app.listen(process.env.PORT || 3000);