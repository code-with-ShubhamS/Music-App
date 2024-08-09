console.log("lets write java script")
let songs; //global variable store all the songs
let currfolder;
let listOfAllSongs;

//seconds to minute
function convertTime(seconds) {
  if(isNaN(seconds) || seconds<0){
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Formatting the output to always show two digits for seconds
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}





let currentAudio = new Audio;

async function getSongs(folder){
  currfolder=folder;
    let song= await fetch(`/songs/${folder}`);  //in this line we are faching our song from our folder
    let response = await song.text();
    // console.log(response)


//creating a div and store all the song data in div in html form    
    let div=document.createElement('div'); 
    div.innerHTML=response;
    // console.log(div)


//we are taking all the ancor tag from the div which have an song link
    let ancorTag = div.getElementsByTagName('a')
    // console.log(ancorTag)

    songs=[];
//in this line we are iterate in the ancorTag(which store all the href) 
//and storing all the song link in the array
     
    for (let index = 0; index < ancorTag.length; index++) {
        const element = ancorTag[index];
        // console.log(element)
        if(element.href.endsWith(".mp3")){
          songs.push(element.href.split(`${folder}/`)[1]) 
                                                       //split remove all the sentences which is before the songs
        }
    }
    let ul = document.querySelector(".songsList").getElementsByTagName('ul')[0];
    ul.innerHTML="";

    for (const song of songs) {
        // ul.innerHTML = ul.innerHTML + `<li> ${song.replaceAll("%20"," ")} </li>` ;
        ul.innerHTML=ul.innerHTML+ 
        ` <li>
        <div class="songBox  flex">

          <div class="song_Icon">
            <img src="image/song_icon.svg" class="invert" alt="">
          </div>

          <div class="song_Detail_container">
            <div class="song_Name">${song.replaceAll("%20"," ")} </div>
            shubham
          </div>

          <div class="play_song_end flex">
            <div class="playSong">Play Song</div>
            <img src="image/playBtn.svg" id="song_container_playBtn" class="invert" alt="">
          </div>
        </div>
       </li>`
    }
   

    //first we can find all the  song name which is in list and store in it array
    listOfAllSongs = Array.from(document.querySelector('.songsList').getElementsByTagName('li'));
    listOfAllSongs.forEach((e)=>{
      e.addEventListener("click",element=>{  //so here we on clicking every list song we find that particular song name and trim it because to remove the space bwteen them

      // e.querySelector("#song_container_playBtn").src="image/pauseBtn.svg";
    
       playMusic(e.querySelector(".song_Name").innerHTML.trim(),false);
       changes(listOfAllSongs,true);

      });
    });
   
    
    return songs;    
}



function changes(listOfAllSongs,boolea){
 let currAud= currentAudio.src.split("/")[5].replaceAll("%20"," ")


  for (let index = 0; index < listOfAllSongs.length; index++) {
    let currAudList = listOfAllSongs[index].querySelector(".song_Name").innerHTML.trim()

  //   if(boolea==false){
  //     listOfAllSongs[index].querySelector("#song_container_playBtn").src="image/playBtn.svg"
  //     return;
  //  }
   if(currAud ==  currAudList && boolea==true){
      listOfAllSongs[index].querySelector("#song_container_playBtn").src ="image/pauseBtn.svg";
    }
    else{
      listOfAllSongs[index].querySelector("#song_container_playBtn").src="image/playBtn.svg"
    }  
  }
 
}


async function displayAlbums(){
     let cardAlbums= await fetch(`/songs`);  
    let response = await cardAlbums.text();
    let div=document.createElement('div'); 
    div.innerHTML=response;
   let ancors=  div.getElementsByTagName("a")
  let array= Array.from(ancors);
  let folderName;
  for (let index = 0; index < array.length; index++) {
    let e = array[index];
    if(e.href.includes("/songs/")){
      // console.log(e.href.split('/').slice(-2)[0]);
       folderName= e.href.split('/').slice(-2)[0];

      let allData= await fetch(`/songs/${folderName}/info.json`);  
      let res = await allData.json();
      // console.log(res);
     let card_container= document.querySelector(".cards-container");
     card_container.innerHTML= card_container.innerHTML +` <div data-folder="${folderName}" class="cards">

     <div class="circle-container">
       <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24" color="#000000" fill="none">
         <path
           d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
           stroke="currentColor" stroke-width="1.5"
           stroke-linejoin="round" />
       </svg>
     </div>

     <img
       src="/songs/${folderName}/cover.jpg"
       alt />
     <h3>${res.tittle} </h3>
     <p>${res.discription}</p>
   </div>`
   }
  }
  Array.from(document.getElementsByClassName("cards")).forEach((e)=>{
    e.addEventListener("click",async items=>{
    //  console.log(items,items.currentTarget.dataset.folder)   
     // console.log(`songs/${currentTarget.dataset.folder}`);
     songs=await getSongs(`/songs/${items.currentTarget.dataset.folder}`)
    })
  })
}



async function main(){
    //geting all the song in the form of array
    await getSongs("/songs/uttrakhand");
    playMusic(songs[0],true);
    await displayAlbums();
 
   //display all the albums in the screen

    let playBtn=document.getElementById("playBtn");
playBtn.addEventListener("click",()=>{
  if(currentAudio.paused){
    currentAudio.play();
        playBtn.src="image/pauseBtn.svg"
        changes(listOfAllSongs,true);
      
      }
      else{
        currentAudio.pause();
        playBtn.src="image/playBtn.svg"
      changes(listOfAllSongs,false);
        }
      
});


currentAudio.addEventListener("timeupdate",()=>{
  // console.log(currentAudio.currentTime,currentAudio.duration)
  let currTime=convertTime(currentAudio.currentTime);
  let currDuration=convertTime(currentAudio.duration)
  // 
  document.querySelector(".songTime").innerText=`${currTime}/${currDuration}`
  document.querySelector(".circle").style.left=(currentAudio.currentTime/currentAudio.duration)*100 +"%";

})

//seek bar 
document.querySelector(".seekBar").addEventListener("click",e=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left=percent +"%";
  currentAudio.currentTime=((currentAudio.duration)*percent)/100;
})

//adding event listner to hamburger 
document.querySelector(".hamburger_svg").addEventListener("click",()=>{
  document.querySelector(".left").style.left=0+"%";
})

//adding event listner on cross
document.querySelector(".cross").addEventListener("click",()=>{
  document.querySelector(".left").style.left=-100 + "%";
})




 //add event lishner on volume 
 document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  // console.log(e.target.value)
  currentAudio.volume=  parseInt(e.target.value)/100;
 });




 //add eventLishner on next button
 let next=document.getElementById("next");
 next.addEventListener("click", () => {
  // currentAudio.pause()
  // console.log("Next clicked")
  
  let index = songs.indexOf(currentAudio.src.split("/").slice(-1)[0])
  if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
  }
  if((index+1)>=songs.length){
    currentAudio.pause();
    document.getElementById("playBtn").src="image/playBtn.svg"
    changes(listOfAllSongs,false);
    return;
  }
  changes(listOfAllSongs,true);
})

//add eventLishner on previous btn
let previous=document.getElementById("previous")
previous.addEventListener("click", () => {
  currentAudio.pause()
  
  // console.log("Previous clicked")
  let index = songs.indexOf(currentAudio.src.split("/").slice(-1)[0])
  if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
  }
  if((index-1)<0){
    currentAudio.pause();
    document.getElementById("playBtn").src="image/playBtn.svg"
    changes(listOfAllSongs,false);
    return;
  }
  changes(listOfAllSongs,true);
})

//onclcik every card we display all songs of that card
Array.from(document.getElementsByClassName("cards")).forEach((e)=>{
  e.addEventListener("click",()=>{
    document.querySelector(".left").style.left=0+"%";
  })})

}
//main end point 


//managing volumeOff svg and volume on svg
let volumeId=document.querySelector(".volumeOff")

volumeId.addEventListener("click", e=>{ 
  if(e.target.src.includes("image/volume.svg")){
      e.target.src = e.target.src.replace("image/volume.svg", "image/volumeOff.svg")
      currentAudio.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
      e.target.src = e.target.src.replace("image/volumeOff.svg", "image/volume.svg")
      currentAudio.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }

})



//this function play the music 
function playMusic(song_Name,pause=false){
 
  //var audio = new Audio("/songs/"+song_Name);
  currentAudio.src= `/${currfolder}/`+song_Name
  document.querySelector(".songInfo").innerText= decodeURI(song_Name);
  if(!pause){
    currentAudio.play();
    playBtn.src="image/pauseBtn.svg"
  
  }
 
}

main();
