var dataenc = "";
var encdata = "";
var videolist = [];
var url_given = "";
var id = url_given.replace("https://youtube.com/watch?v=","").replace("https://youtu.be/","")
var url = "https://www.youtube.com/get_video_info?video_id="+id+"&el=previewpage&hl=en_US"
var skbinterv = ""
//Called when application is started.
function OnStart()
{
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "Vertical,FillXY" );	
layhoz = app.CreateLayout( "Linear", "Horizontal" );

vid = app.CreateVideoView( 1, 0.4 );
vid.SetOnError( function(e) {alert("Error: "+e)} );
lay.AddChild( vid );
// https://youtu.be/F1wnPfr2xi0
txtprompt = app.CreateTextEdit( "", 1 );
btngo = app.CreateButton( "Go!" );
btngo.SetOnTouch( function() {
// HTTP START
url_given = txtprompt.GetText();
var id = url_given.replace("https://youtube.com/watch?v=","").replace("https://youtu.be/","")
var url = "https://www.youtube.com/get_video_info?video_id="+id+"&el=previewpage&hl=en_US"
//alert(id)
app.HttpRequest( "GET", url, null, null, function(scs, data) {
try{
dataenc = decodeURIComponent(data).split("&")
}
catch(e) {
alert("Введите нормальный URL видео с ютуба")
}
for(i=0; i<dataenc.length; i++) {
if( dataenc[i].match(/\bplayer_response*/) == "player_response" ) {
try{
encdata_ = JSON.parse(dataenc[i].replace("player_response=","")).streamingData.formats
encdata = encdata_[encdata_.length-1].url
vid.SetFile( decodeURIComponent(encdata))
vid.Play();

skbinterv = setInterval(function() {
duration = vid.GetDuration();
curpos = vid.GetPosition();
curpos_dec = Math.ceil(curpos)
duration_dec = Math.ceil(duration)
skbvideoyoutube.SetRange( duration );
skbvideoyoutube.SetValue( curpos );
vendormetka.SetText( curpos_dec );
vendormetka1.SetText( duration_dec );
},100)

}
catch(e) {
alert("Error occurred: "+e)
}
// break;
}}}); // << THIS IS END OF HTTP REQUEST AND 'IF' AND 'FOR'
});
vendormetka = app.CreateText( "" );
vendormetka1 = app.CreateText( "" );

skbvidytlay = app.CreateLayout( "Linear", "Horizontal" );

skbvideoyoutube = app.CreateSeekBar( 0.7 );

btnplay = app.CreateButton( "[fa-play]", null, null, "FontAwesome" );
btnplay.SetOnTouch( function() {
vid.Play();
});
skbvideoyoutube.SetOnTouch( function(event) {
vid.SeekTo( event );
});
// 2 END
btnstop = app.CreateButton( "[fa-stop]",null, null, "fontawesome" );
btnstop.SetOnTouch( function() {
clearInterval(skbinterv)
vid.Stop();
});
btnpause = app.CreateButton( "[fa-pause]",null,null,"fontawesome" );
btnpause.SetOnTouch( function() {
vid.Pause();
});
lay.AddChild( txtprompt );
lay.AddChild( btngo );
lay.AddChild( skbvidytlay );
skbvidytlay.AddChild( vendormetka );
skbvidytlay.AddChild( skbvideoyoutube );
skbvidytlay.AddChild( vendormetka1 );
lay.AddChild( layhoz );
layhoz.AddChild( btnplay );
layhoz.AddChild( btnpause );
layhoz.AddChild( btnstop );


	//Add layout to app.
	app.AddLayout( lay );
}