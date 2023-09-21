function editEvent(event){
  console.log("edit event called")
  event.preventDefault()
  let htmltext = "<input type='text' aria-label='creature name' alt='enter creature name' name='name"
  +event+
  "' maxlength='30' required value='"
  +event.name+
  "'><label>Creature type</label><select name='type"
  +event+
  "' value='"
  +event.type+
  "'><option value='Chameleon'>Chameleon</option><option value='Gecko'>Gecko</option><option value='Frog'>Frog</option><option value='Snake'>Snake</option><option value='Cat'>Cat</option><option value='Dog'>Dog</option><option value='Rat'>Rat</option><option value='Capybara'>Capybara</option></select><label>Creature age</label><input type='number' aria-label='creature age' alt='enter creature age' name='age'"
  +event+
  "' min='0' required value='"
  +event.age+"'><button onclick='save("+event+")'>Save</button>";
        document.getElementById("li"+event).innerHTML = htmltext; 


}