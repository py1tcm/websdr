//
// WebSDR JavaScript part
// Copyright 2007-2014, Pieter-Tjerk de Boer, pa3fwm@websdr.org; all rights reserved.
// Naturally, distributing this file by the original WebSDR server software to original WebSDR clients is permitted.


// variables governing what the user listens to:
var lo=-3.0,hi=-0.3;   // edges of passband, in kHz w.r.t. the carrier
var mode="LSB";            // 1 if AM, 0 otherwise (SSB/CW); or text "AM", "FM" etc
var band=0;            // id of the band we're listening to
var freq=bandinfo[0].vfo;  // frequency (of the carrier) in kHz
var memories = [ ];

// A / B vfo variables
var ab_lo=lo;
var ab_hi=hi;
var ab_mode=mode;
var ab_band=band;
var ab_freq=freq;

// bandwidth presets variables
var lsblo=lo;
var lsbhi=hi;
var usblo=0.3
var usbhi=3.0
var amlo=-3.5
var amhi=3.5
var fmlo=-6.25
var fmhi=6.25
var cwlo=-0.95
var cwhi=-0.55

// variables governing what the user sees:
var Views={ allbands:0, othersslow:1, oneband:2, blind:3 };
var view=Views.blind;
var nwaterfalls=0;
var waterslowness=4;
var waterheight=100;
var watermode=1;
var scaleheight=14;


// information about the available "virtual" bands:
// contains: effsamplerate, effcenterfreq, zoom, start, minzoom, maxzoom, samplerate, centerfreq, vfo, scaleimgs, realband
var bi = new Array();
// number of bands:
var nvbands=nbands;


// references to objects on the screen:
var scaleobj;
var scaleobjs = new Array();
var scaleimgs0 = new Array();
var scaleimgs1 = new Array();
var passbandobj;
var edgelowerobj;
var edgeupperobj;
var carrierobj;
var smeterobj;
var numericalsmeterobj;
var smeterpeakobj;
var numericalsmeterpeakobj;
var waterfallapplet = new Array();
var soundapplet = null;

// timers:
var interval_updatesmeter;
var interval_ajax3;
var timeout_idle;
var setfreqif_fut_timer;  // timer for typing in the frequency field

var samplecount=0;
var windowhours=0;
var windowmins=0;
var windowsecs=0;


// misc
var serveravailable=-1;  // -1 means yet to be tested, 0 and 1 mean false and true
var smeterpeaktimer=2;
var smeterpeak=0;
var allloadeddone=false;
var waitingforwaterfalls=0;  // number of waterfallapplets that are still in the process of starting
var band_fetchdxtimer=new Array();
var hidedx=0;
var usejavawaterfall=1;
var usejavasound=1;
var javaerr=0;
var isTouchDev = false;
var smetermintimer=2;	//initialises noise window timer
var smetermin=3000;	//initalises min level (updates recusrively during window)


// derived quantities:
var khzperpixel=bandinfo[band].samplerate/1024;
var passbandobjstart=0;    // position (in pixels) of start of passband on frequency axis, w.r.t. location of carrier
var passbandobjwidth=0;    // width of passband in pixels
var centerfreq=bandinfo[band].centerfreq;

// Remembers which bw preset was pushed for each mode so it can be restored when mode is changed then changed back
function rememberpreset()
{
  if(mode==='LSB') {lsblo=lo; lsbhi=hi;} else
  if(mode==='USB') {usblo=lo; usbhi=hi;} else
  if(mode==='AM') {amlo=lo; amhi=hi;} else
  if(mode==='FM') {fmlo=lo; fmhi=hi} else
    {cwlo=lo; cwhi=hi;}
}

// Detects mode & reveals associated bw-presets. hightlights pressed button
function showhides()
{
     if(mode==='LSB') {showrow('lsbpresets','usbpresets','ampresets','fmpresets','cwpresets');} else
     if(mode==='USB') {showrow('usbpresets','lsbpresets','ampresets','fmpresets','cwpresets');} else
     if(mode==='AM') {showrow('ampresets' ,'usbpresets','lsbpresets','fmpresets','cwpresets');} else
     if(mode==='FM') {showrow('fmpresets' ,'usbpresets','lsbpresets','ampresets','cwpresets');} else
       {showrow('cwpresets' ,'usbpresets','lsbpresets','ampresets','fmpresets');}
}

// Reveals prests according to selected mode (also called to reveal appropriate display options according to which display control is pressed)
function showrow(visiblerow,h1,h2,h3,h4)
{
  var visiblerow;
  var h1;
  var h2;
  var h3;
  var h4;

  {document.getElementById(visiblerow).style.display = "table-row";}
  {document.getElementById(h1).style.display = "none";}
  {document.getElementById(h2).style.display = "none";}
  {document.getElementById(h3).style.display = "none";}
  {document.getElementById(h4).style.display = "none";}
}

function volumedb(a)
{
  document.getElementById('volumedb').innerHTML=" " + a + "dB";
}

function debug(a)
{
//   console.debug(a);
}


// from http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
function cancelEvent(e)
{
  e = e ? e : window.event;
  if(e.stopPropagation) e.stopPropagation();
  if(e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}

function timeout_idle_do()
{
   try { clearInterval(interval_updatesmeter); } catch (e) {} ;
   try { clearTimeout(interval_ajax3); } catch (e) {} ;
   var i;
   try { for (i=0;i<nwaterfalls;i++) waterfallapplet[i].destroy(); } catch (e) {} ;
   try { soundapplet.destroy(); } catch (e) {};

   //if (idletimeout > 3600000) {idle_sub_text = idletimeout/3600000 + " hrs.";}
   if (idletimeout > 59999) {idle_sub_text = idletimeout/60000 + " min.";}
   else if (idletimeout < 60000) {idle_sub_text = idletimeout/1000 + " sec.";}

   idle_page='<div>';
     idle_page+='<div style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px;">';
       idle_page+='<div style="padding: 25px;">';
         idle_page+='<div style="color: #ffffff; background-color: #ff0000; border-color: #ff0000; padding: 15px; border: 1px solid transparent; border-radius: 4px; text-align: center;" role="alert">';
           idle_page+='<span style="text-align: center; font-size: 24px;"><b>Inatividade de usuário.</b></span><br>';
           idle_page+='<span style="text-align: center; font-size: 18px;"><b>Limite de inatividade. Tempo limite: '+ idle_sub_text +'</b></span>';
         idle_page+='</div>';
         idle_page+='<div style="border-radius: 4px; padding: 5px; margin: 8px 0 8px 0; border: solid #ffffff 1px; border: 1px solid transparent; border-radius: 4px; text-align: center;" role="alert">';
           idle_page+='<span style="text-align: center; font-size: 24px;">Caro usuário, para evitar o acionamento do tempo limite devido a inatividade, recomendamos que dentro dos '+ idle_sub_text +' você execute qualquer ação no WebSDR, como por exemplo, alterar a frequência, a faixa etc. Se o WebSDR ficar sem nehuma interação você será automaticamente desconectado a fim de garantir segurança, economizar energia e banda de internet.</span><br>';
         idle_page+='</div>';
         idle_page+='<div style="margin-top: 25px; text-align: center;">';
           idle_page+='<button type="button" style="font-family: inherit; color: black; display: inline-block; padding: 8px; cursor: pointer; font-size: 16px;" onClick="window.location.reload()">Recarregar página do WebSDR</button>';
         idle_page+='</div>';
       idle_page+='</div>';
     idle_page+='</div>';
   idle_page+='</div>';

   document.body.innerHTML=idle_page;

//   document.body.innerHTML="Idle time out.\n";
}


/*
function timeout_idle_do()
{
   try { clearInterval(interval_updatesmeter); } catch (e) {} ;
   try { clearTimeout(interval_ajax3); } catch (e) {} ;
   var i;
   try { for (i=0;i<nwaterfalls;i++) waterfallapplet[i].destroy(); } catch (e) {} ;
   try { soundapplet.destroy(); } catch (e) {};
   document.body.innerHTML="Idle time out.\n";
}
*/

function timeout_idle_restart()
{
   if (!idletimeout) return;
   time_out = (idletimeout / 1000) / 60;
   timeout_secs = samplecount;
   try { clearTimeout(timeout_idle); } catch(e) {};
   timeout_idle=setTimeout('timeout_idle_do();',idletimeout);
}

function send_soundsettings_to_server()
{
  var m=mode;
  if (m=="USB") m=0;
  else if (m=="LSB") m=0;
  else if (m=="CW") m=0;
  else if (m=="AM") m=1;
  else if (m=="FM") m=4;
  try {
     soundapplet.setparam(
         "f="+freq
        +"&band="+band
        +"&lo="+lo
        +"&hi="+hi
        +"&mode="+m
        +"&name="+encodeURIComponent(document.usernameform.username.value) 
        );
  } catch (e) {};
  timeout_idle_restart()
}


function setsquelch(a)
{
   a=Number(a);
   soundapplet.setparam("squelch="+a);
}

function setautonotch(a)
{
   a=Number(a);
   soundapplet.setparam("autonotch="+a);
}

function setautonotch2(a)
{
   a=Number(a);
   soundapplet.setparam2(a);
}

function setnoise(a)
{
   a=Number(a);
   soundapplet.setnoise(a);
}

function setnoisereduction(level)
{
   a=Number(level);
   soundapplet.setparam("noisered="+a);
}
function sethboost(a)
{
   a=Number(a);
   soundapplet.sethboost(a);
}

function setmute(a)
{
   a=Number(a);
   soundapplet.setparam("mute="+a);
}


function draw_passband()
{
   passbandobjstart=Math.round((lo-0.045)/khzperpixel);
   passbandobjwidth=Math.round((hi+0.045)/khzperpixel)-passbandobjstart;
   if (passbandobjwidth == 0) passbandobjwidth = 1;
   passbandobj.style.width=passbandobjwidth+"px";
   if (!scaleobj) return;

   var x=(freq-centerfreq)/khzperpixel+512;
   var maxx = parseInt(scaleobj.style.width);
   if (isTouchDev && x > maxx) x = maxx;
   var y=scaleobj.offsetTop+15;
   passbandobj.style.top=y+"px";
   edgelowerobj.style.top=y+"px";
   edgeupperobj.style.top=y+"px";
   carrierobj.style.top=y+"px";
   carrierobj.style.left=x+"px";
   x=x+passbandobjstart;
   passbandobj.style.left=x+"px";
   edgelowerobj.style.left=(x-11)+"px";
   edgeupperobj.style.left=(x+passbandobjwidth)+"px";
}


function iscw()
{
   return hi-lo < 1.0;
}

function nominalfreq()
{
   if (iscw()) return freq+(hi+lo)/2;
   return freq;
}

function freq2x(f,b)
{
   return (f-bi[b].effcenterfreq)*1024/bi[b].effsamplerate+512;
}

function setwaterfall(b,f)
// adjust waterfall so passband is visible
{
   if (waitingforwaterfalls>0) return;
   var x = freq2x(f,b);
   if (x<0 || x>=1024) wfset_freq(b, bi[b].zoom, f);
}


function dx(freq,mode,text)
// called by updates fetched from the server
{
   dxs.push( { freq:freq, mode:mode, text:text } );
}

function setfreqm(b,f,mo)
{
   setband(b);
   set_mode(mo);
   if (iscw()) f-=(hi+lo)/2;
   setfreq(f);
}


function showdx(b)
{
   var s='';
   if (!hidedx) {
      var mems=memories.slice();
      for (i=0;i<mems.length;i++) mems[i].nr=i;
      mems.sort(function(a,b){return a.nomfreq-b.nomfreq});
      for (i=0;i<dxs.length;i++) {
         var x = freq2x(dxs[i].freq,b);
         var nextx;
         if (x>1024) break;
         if (i<dxs.length-1) nextx=freq2x(dxs[i+1].freq,b);
         else nextx=1024;
         if (nextx>=1024) nextx=1280;
         if (x<0) continue;
         var fr=dxs[i].freq;
         var mo=dxs[i].mode;
         s+='<div title="" class="statinfo2" style="max-width:'+(nextx-x)+'px;left:'+(x-6)+'px;top:'+(44-scaleheight)+'px;">';
         s+='<div class="statinfo1"><div class="statinfo0" onclick="setfreqm(b,'+fr+','+"'"+mo+"'"+');">'+dxs[i].text+'<\/div><\/div><\/div>';
         s+='<div title="" class="statinfol" style="width:1px;height:44px;position:absolute;left:'+x+'px;top:-'+scaleheight+'px;"><\/div>';
      }
      for (i=0;i<mems.length;i++) if (mems[i].band==b) {
         var x=freq2x(mems[i].nomfreq,b);
         var nextx;
         if (x>1024) break;
         if (i<mems.length-1) nextx=freq2x(mems[i+1].nomfreq,b);
         else nextx=1024;
         if (nextx>=1024) nextx=1280;
         if (x<0) continue;
         var fr=mems[i].freq;
         var mo=mems[i].mode;
         s+='<div title="" class="statinfo2l" style="max-width:'+(nextx-x)+'px;left:'+(x-6)+'px;top:'+(64-scaleheight)+'px;">';
         var l=mems[i].label;
         if (!l || l=='') l='mem '+mems[i].nr;
         s+='<div class="statinfo1l"><div class="statinfo0l" onclick="setfreqm(b,'+fr+','+"'"+mo+"'"+');">'+l+'<\/div><\/div><\/div>';
         s+='<div title="" class="statinfoll" style="width:1px;height:64px;position:absolute;left:'+x+'px;top:-'+scaleheight+'px;"><\/div>';
      }
   }
   document.getElementById('blackbar'+band2id(b)).innerHTML=s;
   if (s!='') {
      document.getElementById('blackbar'+band2id(b)).style.height='64px';
   } else {
      document.getElementById('blackbar'+band2id(b)).style.height='30px';
   }
}

function fetchdx(b)
{
  var xmlHttp;
  try { xmlHttp=new XMLHttpRequest(); }
    catch (e) { try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e) { try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { alert("Seu browser não possui suporte ao AJAX!"); return false; } } }
  xmlHttp.onreadystatechange=function()
    {
    if(xmlHttp.readyState==4)
      {
        if (xmlHttp.responseText!="") {
          eval(xmlHttp.responseText);
          showdx(b);
        }
      }
    }
  var url="/~~fetchdx?min="+(bi[b].effcenterfreq-bi[b].effsamplerate/2)+"&max="+(bi[b].effcenterfreq+bi[b].effsamplerate/2);
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
}


function setscaleimgs(b,id)
{
   var e=bi[b];
   var st=e.start>>(e.maxzoom-e.zoom);
   if (st<0) scaleimgs0[id].src="scaleblack.png";
   else scaleimgs0[id].src = e.scaleimgs[e.zoom][st>>10];
   if (e.scaleimgs[e.zoom][1+(st>>10)]) scaleimgs1[id].src = e.scaleimgs[e.zoom][1+(st>>10)];
   else scaleimgs1[id].src="scaleblack.png";
   st+=1024;
   scaleimgs0[id].style.left = (-(st%1024))+"px";
   scaleimgs1[id].style.left = (1024-(st%1024))+"px";
}


// this function is called from java when the scrollwheel is moved to change the zoom
function zoomchange(id,zoom,start)
{
   var b=id2band(id);
   var e=bi[b];
   var oldzoom=e.zoom;
   e.effsamplerate = e.samplerate/(1<<zoom);
   e.effcenterfreq = e.centerfreq - e.samplerate/2 + (start*(e.samplerate/(1<<e.maxzoom))/1024) + e.effsamplerate/2;
   e.zoom=zoom;
   e.start=start;
   setscaleimgs(b,id);
   if (b==band) {
      khzperpixel = bi[band].effsamplerate/1024;
      centerfreq = bi[band].effcenterfreq;
      updbw();
   }
   if (!hidedx) {
      clearTimeout(band_fetchdxtimer[b]);
      if (zoom!=oldzoom) {
         dxs=[]; document.getElementById('blackbar'+id).innerHTML="";
         fetchdx(b);
      } else {
         {
            showdx(b);
            band_fetchdxtimer[b] = setTimeout('dxs=[]; fetchdx('+b+');',400);
         }
      }
   }
}


var dont_update_textual_frequency=false;

function setfreq(f)
{
   try { clearTimeout(setfreqif_fut_timer); } catch (e) {} ;
   freq=f;
   document.getElementById("dummyforie").style.display = 'none'; document.getElementById("dummyforie").style.display = 'block';  // utter nonsense, but forces IE8 to update the screen :(
   send_soundsettings_to_server();
   if (view!=Views.blind) draw_passband();
   if (dont_update_textual_frequency) return;
   var nomfreq=nominalfreq();
   if (freq.toFixed) document.freqform.frequency.value=nomfreq.toFixed(2);
   else document.freqform.frequency.value=nomfreq+" kHz";
}

function setfreqb(f)
// sets frequency but also autoselects band
{
   if (iscw()) f-=(hi+lo)/2;
   var e=bi[band];
   if (f>e.centerfreq-e.samplerate/2-4 && f<e.centerfreq+e.samplerate/2+4) {
      // new frequency is in the current band
      setwaterfall(band,f);
      setfreq(f);
      return;
   }
   // new frequency is not in the current band: then search through all bands until we find the right one (if any)
   for (i=0;i<nvbands;i++) {
      e=bi[i];
      c=e.centerfreq;
      w=e.samplerate/2+4;
      if (f>c-w && f<c+w) {
         e.vfo=f;
         setband(i);
         return;
      }
   }
}



function setfreqif(str)
// called when frequency is entered textually
{
   f=parseFloat(str);
   if (!(f>0)) return;
   dont_update_textual_frequency=true;
   setfreqb(f);
   dont_update_textual_frequency=false;
   document.freqform.frequency.value=str;
}

function setfreqif_fut(str)
// called when typing in the frequency field; schedules a frequency update in the future, in case no more key presses follow soon
{
   try { clearTimeout(setfreqif_fut_timer); } catch (e) {} ;
   setfreqif_fut_timer = setTimeout('setfreqif('+str+')',1000);
}


function setmf(m, l, h)   // "set mode and filter"
{
   mode=m.toUpperCase();
   lo=l;
   hi=h;
   updbw();
}

function set_mode(m)      // ...with appropriate filter
{
   switch (m.toUpperCase()) {
/*
      case "USB": setmf("usb", 0.3,  2.7); break;
      case "LSB": setmf("lsb", -2.7, -0.3); break;
      case "AM":  setmf("am", -4,  4); break;
      case "CW":  setmf("cw", -0.95,  -0.55); break;
      case "FM":  setmf("fm", -6,  6); break;
*/
      case "USB":     setmf("usb",usblo,usbhi); showhides(); break;
      case "LSB":     setmf("lsb",lsblo,lsbhi); showhides(); break;
      case "AM":      setmf("am",amlo,amhi); showhides(); break;
      case "FM":      setmf("fm",fmlo,fmhi); showhides(); break;
      case "CW":      setmf("cw",cwlo,cwhi); showhides(); break;
   }
}


function freqstep(st)
// do a frequency step, suitable for the current mode
// sign of st indicates direction
// magnitude of st is 1,2 or 3 for small, medium, or large step, with large being one channel (where applicable)

// Adicionado função para o botão central beat 0 (14/03/2021)

{
   var f=nominalfreq();
// Função 0 beat
   if (st == "9") {
      if(mode=="CW"){
         f=Math.round(f);
         setfreq(f-(hi+lo)/2);
      }
      else {
       f = Math.round(f);
      setfreq(f);
      }
   }
   else {
   var steps_ssb= [0.1, 0.5, 1 ];
   var steps_am5= [0.1, 1, 5];
   var steps_am9= [0.1, 1, 10];
   var steps_fm= [1, 5, 12.5 ];
   var steps=steps_ssb;
   var grid=false;
   var i=Math.abs(st)-1;
   }
   if (mode=="AM") {
      if (freq<1800) steps=steps_am9; else steps=steps_am5;
      if (i>=1) grid=true;
   }
   if (mode=="FM") {
      steps=steps_fm;
      if (i>=1) grid=true;
   }
   var d=steps[i];
   var f=(st>0)?f:-f;
   if (!grid) f=f+d;
   else f=d*Math.ceil(f/d+0.1);
   f=(st>0)?f:-f;
   if (iscw()) f-=(hi+lo)/2;
   setfreq(f);
}

function setfreqtune(s)
{
   var param = new RegExp("([0-9.]*)([^&#]*)").exec(s);
   if (!param[1]) return;
   if (param[2]) set_mode(param[2]);
   setfreqif(param[1]);
}

var memories_backup=[];

function mem_save()
{
   try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
}

var mem_hilite=-1;
var ab_mem_hilite=-1;

function mem_recall(i)
{
   setband(memories[i].band);
   mode=memories[i].mode;
   lo=memories[i].lo;
   hi=memories[i].hi;
   updbw();
   setfreq(memories[i].freq);
   setwaterfall(band,memories[i].freq);
}

function mem_erase(i)
{
   var b=memories[i].band;
   memories.splice(i,1);
   mem_show();
   showdx(b);
   try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
}

function mem_store(i)
{
   var nomf=nominalfreq();
   var l;
   try { l=memories[i].label;} catch(e){ l=''; };
   memories[i]={freq:freq, nomfreq:nomf, band:band, mode:mode, lo:lo, hi:hi, label:l };
   mem_show();
   showdx(memories[i].band);
   try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
}

function mem_label(i,nw)
{
   memories[i].label=nw;
   showdx(memories[i].band);
   try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
}

function mem_show()
{
   var i;
   var s="";
   for (i=0;i<memories.length;i++) {
      var m="";
      m=memories[i].mode;
      s+='<tr>';
      s+='<td><input type="button" title="recuperar" value="recuperar" onclick="mem_recall('+i+')"><input type="button" title="apagar" value="apagar" onclick="mem_erase('+i+')"><input type="button" title="salvar" value="salvar" onclick="mem_store('+i+')"></td>';
      s+='<td>'+memories[i].nomfreq.toFixed(2)+' kHz '+m+'</td>';
      s+='<td><input title="Nome para esta memória" type="text" size=6 onchange="mem_label('+i+',this.value)" value="'+memories[i].label+'"></td>';
      s+='</tr>';
   }
   s+='<tr>';
   s+='<td><input type="button" disabled title="recuperar" value="recuperar" onclick="mem_recall('+i+')"><input type="button" disabled title="apagar" value="apagar" onclick="mem_erase('+i+')"><input type="button" title="salvar" value="salvar" onclick="mem_store('+i+')"></td>';
   s+='<td>(novo)</td>';
   s+='</tr>';
   document.getElementById('memories').innerHTML='<table>'+s+'</table>';
}

function vfos_toggle()
{
   var tmp;
   tmp=ab_lo; ab_lo=lo; lo=tmp;
   tmp=ab_hi; ab_hi=hi; hi=tmp;
   tmp=ab_mode; ab_mode=mode; mode=tmp;
   tmp=ab_band; ab_band=band; band=tmp;
   tmp=ab_freq; ab_freq=freq; freq=tmp;
   tmp=ab_mem_hilite; ab_mem_hilite=mem_hilite;
   setband(band);
   setfreq(freq);
   updbw();
   mem_hilite=tmp;
   if (mem_hilite>=0) document.getElementById('membutton'+mem_hilite).style.backgroundColor='#ffff80';
   setwaterfall(band,freq);

   showhides();
}

function vfos_equal()
{
   ab_lo=lo;
   ab_hi=hi;
   ab_mode=mode;
   ab_band=band;
   ab_freq=freq;
   ab_mem_hilite=mem_hilite;
}

function wfset_freq(b, zoom, f)
{
   // set waterfall for band 'b' to given zoomlevel and centerfrequency
   var id=band2id(b);
   var e=bi[b];
   var effsamplerate = e.samplerate/(1<<zoom);
   var start = ( f - e.centerfreq + e.samplerate/2 - effsamplerate/2 )*1024/(e.samplerate/(1<<e.maxzoom));
   waterfallapplet[id].setzoom(zoom, start);
   timeout_idle_restart()
}

function wfset(cmd)
{
   var b=band;
   var e=bi[b];
   var id=band2id(b);
   timeout_idle_restart()
   if (cmd==0) {
      // zoom in
      //var x=(freq-centerfreq)/khzperpixel+512;
      var x=512;
      waterfallapplet[id].setzoom(-2, x);
      return;
   }
   if (cmd==1) {
      // zoom out
      //var x=(freq-centerfreq)/khzperpixel+512;
      var x=512;
      waterfallapplet[id].setzoom(-1, x);
      return;
   }
   if (cmd==2) {
      // zoom in deep with current listening frequency centered
      wfset_freq(b, e.maxzoom, freq);
   }
   if (cmd==4) {
      // zoom fully out
      waterfallapplet[id].setzoom(0, 0);
   }
}


function setview(v)
{
   timeout_idle_restart()
   if ((v==Views.allbands && view==Views.othersslow) || (view==Views.allbands && v==Views.othersslow)) {
      // no need to restart the applets in this case
      view=v;
      createCookie("view",view,3652);
      waterfallspeed(waterslowness);
      return;
   }

   if (view==Views.blind) {
      var els = document.getElementsByTagName('*');
      for (i=0; i<els.length; i++) {
         if (els[i].className=="hideblind") els[i].style.display="inline";
         if (els[i].className=="showblind") els[i].style.display="none";
      }
   }
   for (i=0;i<nwaterfalls;i++) waterfallapplet[i].destroy();

   view=v;
   createCookie("view",view,3652);

   document_waterfalls();  // (re)start the waterfall applets

   if (view==Views.blind) {
      var els = document.getElementsByTagName('*');
      for (i=0; i<els.length; i++) {
         if (els[i].className=="showblind") els[i].style.display="inline";
         if (els[i].className=="hideblind") els[i].style.display="none";
      }
      return;
   }

   sethidedx(hidedx);
}


function islsbband(b)
{
   // returns true if default SSB mode for this band should be LSB
   var e=bi[b];
   if (e.centerfreq>3500 && e.centerfreq<4000) return 1;
   if (e.centerfreq>1800 && e.centerfreq<2000) return 1;
   if (e.centerfreq>7000 && e.centerfreq<7400) return 1;
   return 0;
}

function setband(b)
{
   if (b<0 || b>=nvbands) return;
   bi[band].vfo=freq;
  
   if (islsbband(band)!=islsbband(b)) {
      // if needed, exchange LSB/USB 
      var tmp=hi;
      hi=-lo;
      lo=-tmp;
      if (mode=="USB") mode="LSB";
      else if (mode=="LSB") mode="USB";
   }

   band=b;
   var e=bi[b];
//   if (nbands>1) document.freqform.group0[band].checked=true;
   if (nbands>1) {
     document.freqform.group0[band].checked=true;

   }
   if (view==Views.allbands || view==Views.othersslow) {
      scaleobj = scaleobjs[b];
   } else if (view==Views.oneband) {
      scaleobj = scaleobjs[0];
      setscaleimgs(b,0);
      if (waitingforwaterfalls==0) waterfallapplet[0].setband(b, e.maxzoom, e.zoom, e.start);
      if (!hidedx) {
         clearTimeout(band_fetchdxtimer[b]);
         dxs=[]; document.getElementById('blackbar0').innerHTML=""; 
         fetchdx(b);
       }
   }
   setwaterfall(b,e.vfo);
   centerfreq = e.effcenterfreq;
   khzperpixel = e.effsamplerate/1024;
   setfreq(e.vfo);
   waterfallspeed(waterslowness);

   try {
      document.getElementById('btnB-'+band).style='min-width: 45px;border-style: inset;color: blue;';
      var ar=['0','1','2','3','4','5','6','7'];
      var i;
      for (i=0;i<ar.length;i++) if (ar[i]!=band) document.getElementById('btnB-'+ar[i]).style='min-width: 45px;';
   } catch(e) {};
}


function sethidedx(h)
{
   hidedx=h;
   if (view==Views.oneband) {
      if (hidedx) {
         dxs=[]; document.getElementById('blackbar0').innerHTML=""; 
         clearTimeout(band_fetchdxtimer[band]);
         document.getElementById('blackbar0').style.height='30px';
      } else {
         showdx(band);
         fetchdx(band);
      }
   } else {
      for (b=0;b<nvbands;b++) {
         if (hidedx) {
            dxs=[]; document.getElementById('blackbar'+band2id(b)).innerHTML=""; 
            clearTimeout(band_fetchdxtimer[b]);
            document.getElementById('blackbar'+band2id(b)).style.height='30px';
         } else {
            showdx(b);
            fetchdx(b);
         }
      }
   }
}


function test_serverbusy()
{
   try { soundapplet.app.l=1; } catch (e) {};
   try { serveravailable=soundapplet.getid(); } catch (e) {};
   if (serveravailable==0) {
      try { clearInterval(interval_updatesmeter); } catch (e) {} ;
      try { clearTimeout(interval_ajax3); } catch (e) {} ;
      var i;
      try { for (i=0;i<nwaterfalls;i++) waterfallapplet[i].destroy(); } catch (e) {} ;
      try { soundapplet.destroy(); } catch (e) {};
      document.body.innerHTML="Desculpe, este WebSDR está com ocupação total no momento; por favor tente novamente mais tarde.\n";
   }
}


var sgraph={
   prevt: 0,
   e0: 80,     // current lower end of scale
   e1: -190,   // current upper end of scale
   d0: 80,     // current estimate of lowest value of interest
   d1: -190,   // current estimate of highest value of interest
   width: 200,
   cnt: 0
};

function s2y(s)
{
   return sgraph.cv.height-(s-sgraph.e0)/(sgraph.e1-sgraph.e0)*sgraph.cv.height;
}

function updatesmeter()
{
   if (!allloadeddone) return;

   try {
      var s=soundapplet.smeter();
   } catch (e) { s=0; };
   var c=''+(s/100.0-127).toFixed(1);
   if (c.length<6) c='&nbsp;&nbsp;'+c;
   numericalsmeterobj.innerHTML = c;
   if (s>=0) smeterobj.style.width= s*0.0191667+"px";
   else smeterobj.style.width="0px";
   smeterpeaktimer--;
   if ((smeterpeak<s-0.1) || (smeterpeaktimer<=0)) {
      smeterpeak=s;
      smeterpeaktimer=10;
      if (smeterpeak>=0) smeterpeakobj.style.width= smeterpeak*0.0191667 +"px";
      else smeterpeakobj.style.width="0px";
      var c=''+(s/100.0-127).toFixed(1);
      if (c.length<6) c='&nbsp;&nbsp;'+c;
      numericalsmeterpeakobj.innerHTML = c;
   }

   if (serveravailable<0) test_serverbusy();

   // rest of this function is for drawing the signal strength plot

   var v=document.getElementById('sgraphchoice').value;
   if (!(v>0)) {
      if (sgraph.cv) {
         sgraph.ct.clearRect(0,0,sgraph.cv.width, sgraph.cv.height);
         sgraph.cv.style.display='none';
         sgraph.cv=null;
         sgraph.e0=80;
         sgraph.e1=-190;
      }
      return;
   }

   if (!sgraph.cv) {
      sgraph.cv=document.getElementById('sgraph');
      sgraph.cv.style.display='';
      sgraph.ct=sgraph.cv.getContext("2d");
   }
   var cv=sgraph.cv;
   var ct=sgraph.ct;
   sgraph.width=cv.width-50;

   s=s/100.0-127;
   // try to estimate the useful range of values, without storing all datapoints, and rescale the plot if needed
   if (sgraph.d0>s) sgraph.d0=s; else sgraph.d0+=0.1/v;
   if (sgraph.d1<s) sgraph.d1=s; else sgraph.d1-=0.1/v;
   var redrawaxis=0;
   if (sgraph.d0>sgraph.e0+15 || sgraph.d0<sgraph.e0) { 
      var e0=10*Math.floor(sgraph.d0/10)-5;
      if (e0>sgraph.e0) ct.drawImage(cv, 0,0, sgraph.width,cv.height*(sgraph.e1-e0)/(sgraph.e1-sgraph.e0), 0,0,sgraph.width,cv.height);
      else {
         var f=(sgraph.e1-sgraph.e0)/(sgraph.e1-e0);
         ct.drawImage(cv, 0,0, sgraph.width,cv.height, 0,0,sgraph.width,cv.height*f);
         ct.fillStyle="white";
         ct.fillRect(0,Math.floor(cv.height*f),sgraph.width,cv.height*(1-f)+1);
      }
      sgraph.e0=e0;
      redrawaxis=1;
   }
   if (sgraph.d1>sgraph.e1 || sgraph.d1<sgraph.e1-15) {
      var e1=10*Math.ceil(sgraph.d1/10)+5;
      if (e1<sgraph.e1) {
         var f=(e1-sgraph.e0)/(sgraph.e1-sgraph.e0);
         if (f<0) f=0;
         ct.drawImage(cv, 0,cv.height*(1-f), sgraph.width,cv.height*f, 0,0,sgraph.width,cv.height);
      } else {
         var f=(sgraph.e1-sgraph.e0)/(e1-sgraph.e0);
         if (f<0) f=0;
         ct.drawImage(cv, 0,0, sgraph.width,cv.height, 0,cv.height*(1-f),sgraph.width,cv.height*f);
         ct.fillStyle="white";
         ct.fillRect(0,0,sgraph.width,Math.ceil(cv.height*(1-f)));
      }
      sgraph.e1=e1;
      redrawaxis=1;
   }
   if (redrawaxis) {
      ct.clearRect(sgraph.width,0,cv.width-sgraph.width,cv.height);
      var w=sgraph.e0;
      ct.fillStyle="black";
      ct.font="10px Verdana";
      while ((w=10*Math.ceil(w/10))<=sgraph.e1) {
         var y=s2y(w);
         ct.fillText(w+" dB",sgraph.width+2,y+4,cv.width-sgraph.width);
         w+=1;
      }
   }

   sgraph.cnt++;
   if (sgraph.cnt>=v) {
      sgraph.cnt=0;
      ct.drawImage(cv, 1,0,sgraph.width-1,cv.height, 0,0,sgraph.width-1,cv.height);  // move the plot one pixel to the left
      var t=new Date().getTime();
      if (v>=10) v=60;
      if (Math.floor(t/1000/v)!=Math.floor(sgraph.prevt/1000/v)) {
         // draw grey vertical line as time marker
         ct.fillStyle="rgba(210,210,210,1)";
         ct.fillRect(sgraph.width-1,0,1,cv.height);
         sgraph.prevt=t;
      } else {
         // draw white vertical line with grey dB scale markers
         ct.fillStyle="white";
         ct.fillRect(sgraph.width-1,0,1,cv.height);
         ct.fillStyle="rgba(210,210,210,1)";
         var w=sgraph.e0;
         while ((w=10*Math.ceil(w/10))<=sgraph.e1) {
            var y=s2y(w);
            ct.fillRect(sgraph.width-1,y,1,1);
            w+=1;
         }
      }
   }

   // plot the actual data point
   ct.fillStyle="blue";
   ct.fillRect(sgraph.width-1,s2y(s),1,1);
}


var uu_names=new Array();
var uu_bands=new Array();
var uu_freqs=new Array();
var others_colours=[ "#ff4040", "#ffa000", "#a0a000", "#80ff00", "#00ff00", "#00a0a0", "#0080ff", "#ff40ff"];

var dxs=[];

function uu(i, username, band, freq)
// called by updates fetched from the server
{
   uu_names[i]=username;
   uu_bands[i]=band;
   uu_freqs[i]=freq;
}

var uu_compactview=false;

//Função para colocar os usuarios na lista como botões 24/11/2019
function douu()
// draw the diagram that shows the other listeners
{
   s='';
   total=0;
   for (b=0;b<nbands;b++) {
      if (!uu_compactview) {
         s+="<p><div align='left' style='width:1024px; background-color:black;'><div class=others>";
         for (i=0;i<uu_names.length;i++) if (uu_bands[i]==b && uu_names[i]!="") {
            cbandfreq=bandinfo[b].centerfreq-(bandinfo[b].samplerate/2);
	    if (uu_names[i]=="WebSDR Volta Redonda") {
              s+='<div id="user'+i+'" align="center" style="position:relative;left:'+(uu_freqs[i]*1024-250)+'px;width:500px; color:#ff3333;">';
              s+='<button type="button" class="userbtn" onclick="setfreqb('+(uu_freqs[i]*bandinfo[b].samplerate+cbandfreq).toFixed(2)+');" title="Operador" style="cursor: pointer;margin:0; padding:0 4px; color:#ff3333;">'+uu_names[i]+'</button>';
              s+='</div>';
              total++;
 	    }
	    else {
              s+='<div id="user'+i+'" align="center" style="position:relative;left:'+(uu_freqs[i]*1024-250)+'px;width:500px; color:'+others_colours[i%8]+';">';
              s+='<button type="button" class="userbtn" onclick="setfreqb('+(uu_freqs[i]*bandinfo[b].samplerate+cbandfreq).toFixed(2)+');" style="cursor: pointer;margin:0; padding:0 4px; color:'+others_colours[i%8]+'; background-color:black;">'+uu_names[i]+'</button>';
              s+='</div>';
              total++;
            }
         }
         s+="<img src="+bi[b].scaleimgs[0][0]+"></div></div></p>";
      } else {
         s+="<p><div align='left' style='width:1024px;height:13px;position:relative; background-color:black;'>";
         for (i=0;i<uu_names.length;i++) if (uu_bands[i]==b && uu_names[i]!="") {
	    if (uu_names[i]=="WebSDR Volta Redonda") {
              s+="<div id='user"+i+"' style='position:absolute;top:1px;left:"+
                   (uu_freqs[i]*1024)
                   +"px;width:1px;height:10px; background-color:#ff3333;'></div>";
              total++;
            }
	    else {
              s+="<div id='user"+i+"' style='position:absolute;top:1px;left:"+
                   (uu_freqs[i]*1024)
                   +"px;width:1px;height:13px; background-color:"+others_colours[i%8]+";'></div>";
              total++;
            }
         }
         s+="</div><div><img src="+bi[b].scaleimgs[0][0]+"></div></p>";
      }
   }
   usersobj.innerHTML=s;
   numusersobj.innerHTML=total;
}


function setcompactview(c)
{
   uu_compactview=c;
   douu();
}


function ajaxFunction3()
{
  var xmlHttp;
  try { xmlHttp=new XMLHttpRequest(); }
    catch (e) { try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e) { try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { alert("Seu browser não possui suporte ao AJAX!"); return false; } } }
  xmlHttp.onreadystatechange=function()
    {
    if(xmlHttp.readyState==4)
      {
        if (xmlHttp.status==200 && xmlHttp.responseText!="") {
          eval(xmlHttp.responseText);
          douu();
        }
        clearTimeout(interval_ajax3);
        interval_ajax3 = setTimeout('ajaxFunction3()',1000);
      }
    }
  interval_ajax3 = setTimeout('ajaxFunction3()',120000);
  var url="/~~othersjj?chseq="+chseq;
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
}



function javatest()
{
   var javaversion;
   try {
      javaversion = soundapplet.javaversion();
   } catch(err) {
      javaerr=1;
      if (!usejavasound) return;
      document.getElementById("javawarning").style.display= "block";
      javaversion="999";
      setTimeout('javatest()',1000); // in case loading java was simply taking too long
   }
   if (javaversion<"1.4.2") {
      document.getElementById("javawarning").innerHTML='A versão do Java '+javaversion+', é muito antiga para o WebSDR. Por favor instale a versão 1.4.2 ou superior de <a href="http://www.java.com">http://www.java.com</a> se você não ouve som.';
      document.getElementById("javawarning").style.display= "block";
   }
}



function updbw()
{
   if (lo>hi) {
      if (document.onmousemove == useMouseXYloweredge || touchingLower) lo=hi;
      else hi=lo;
   }
   var maxf=(mode=="FM") ? 15 : (bandinfo[band].maxlinbw*0.95);
   if (lo<-maxf) lo=-maxf;
   if (hi>maxf) hi=maxf;
   var x6=document.getElementById('numericalbandwidth6');
   var x60=document.getElementById('numericalbandwidth60');
   x6.innerHTML=(hi-lo+0.091).toFixed(2);
   x60.innerHTML=(hi-lo+0.551).toFixed(2);
   try {
      document.getElementById('btn-'+mode).style='width: 65px;border-style: inset;color: blue;';
      var ar=['AM','FM','USB','LSB','CW','AMSYNC','AMCOSTAS','AMN','FMN','USBN','LSBN','CWN'];
      var i;
      for (i=0;i<ar.length;i++) if (ar[i]!=mode) document.getElementById('btn-'+ar[i]).style='width: 65px;';
   } catch(e) {};

   setfreq(freq);

   try {
      document.getElementById('btnB-'+band).style='min-width: 45px;border-style: inset;color: blue;';
      var ar=['0','1','2','3','4','5','6','7'];
      var i;
      for (i=0;i<ar.length;i++) if (ar[i]!=band) document.getElementById('btnB-'+ar[i]).style='min-width: 45px;';
   } catch(e) {};

}


// from http://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}


function id2band(id)
{
   if (view == Views.oneband) return band; else return id;
}

function band2id(b)
{
   if (view == Views.oneband) return 0; else return b;
}

function waterfallspeed(sp)
{
   waterslowness=sp;
   if (waitingforwaterfalls>0) return;
   var done=0;
   if (view==Views.othersslow) {
      for (i=0;i<nwaterfalls;i++)
         if (i==band) waterfallapplet[i].setslow(sp);
         else waterfallapplet[i].setslow(100);
   } else {
      for (i=0;i<nwaterfalls;i++)
         waterfallapplet[i].setslow(sp);
   }
}

function waterfallheight(si)
{
   waterheight=si;
   if (waitingforwaterfalls>0) return;
   for (i=0;i<nwaterfalls;i++) {
      waterfallapplet[i].setSize(1024,si);
   }

   var y=scaleobj.offsetTop+15;
   passbandobj.style.top=y+"px";
   edgelowerobj.style.top=y+"px";
   edgeupperobj.style.top=y+"px";
   carrierobj.style.top=y+"px";
}

function waterfallmode(m)
{
   watermode=m;
   if (waitingforwaterfalls>0) return;
   for (i=0;i<nwaterfalls;i++) {
      waterfallapplet[i].setmode(m);
   }
}



function soundappletstarted()
{
   if (usejavasound && javaerr) {
      javaerr=0;
      document.getElementById("javawarning").style.display= "none";
   }
   setTimeout('soundappletstarted2()',100);
}

function soundappletstarted2()
{
   allloadeddone=true;

   soundapplet.setvolume(Math.pow(10, document.getElementById('volumecontrol2').value /10.));

   if (bi[0]) {
      setfreqif(freq);
      updbw();
   }

   try { setmute(document.getElementById('mutecheckbox').checked) } catch(e){};
   try { setsquelch(document.getElementById('squelchcheckbox').checked) } catch(e){};
   try { setautonotch(document.getElementById('autonotchcheckbox').checked) } catch(e){};

   test_serverbusy();
}


function waterfallappletstarted(id)
{
   // this function is called when a waterfall applet becomes active
   waitingforwaterfalls--;
   if (waitingforwaterfalls<0) waitingforwaterfalls=0; // shouldn't happen...
   if (waitingforwaterfalls!=0) return;
   setTimeout('allwaterfallappletsstarted()',100);
}

function allwaterfallappletsstarted() 
{
   var i;

   waterfallspeed(waterslowness);
   waterfallmode(watermode);

   for (i=0;i<nwaterfalls;i++) {
      var e=bi[i];
      waterfallapplet[i].setband(e.realband, e.maxzoom, e.zoom, e.start);
   }
   if (view==Views.oneband) {
      var e=bi[band];
      waterfallapplet[0].setband(band, e.maxzoom, e.zoom, e.start);
   }

   // and when the applets run, we can also be sure that the HTML elements for the frequency scale have been rendered:
   for (i=0;i<nwaterfalls;i++) {
     scaleobjs[i] = document.getElementById('clipscale'+i);
     scaleimgs0[i] = document.images["s0cale"+i];
     scaleimgs1[i] = document.images["s1cale"+i];
   }
   if (view==Views.oneband) {
      setscaleimgs(band,0);
      scaleobj = scaleobjs[0];
   } else {
      for (i=0;i<nwaterfalls;i++) setscaleimgs(i,i);
      scaleobj=scaleobjs[band];
   }
   draw_passband();
}

var sup_socket = !!window.WebSocket && !!WebSocket.CLOSING;   // the CLOSING test excludes browsers with an old version of the websocket protocol, in particular Safari 5
var sup_canvas = !!window.CanvasRenderingContext2D;
var sup_webaudio = window.AudioContext || window.webkitAudioContext;
var sup_mozaudio = false;
try { if (typeof(Audio)==='function' && typeof(new Audio().mozSetup)=='function') sup_mozaudio = true; } catch (e) {};

function html5javawarn()
{
   // show warning regarding support for HTML5 or Java if needed
   document.getElementById("javawarning").style.display= (usejavasound && javaerr) ? "block" : "none";
   document.getElementById("html5warning").style.display= (!usejavasound && !sup_webaudio && !sup_mozaudio) ? "block" : "none";
}


function html5orjava(item,usejava)
{
   if (item==0) {
      // waterfall
      if (usejavawaterfall==usejava) return;
      usejavawaterfall=usejava;
      var s=(usejavawaterfall?"y":"n")+(usejavasound?"y":"n");
      createCookie("usejava",s,3652);
      var i;
      try { for (i=0;i<nwaterfalls;i++) waterfallapplet[i].destroy(); } catch (e) {} ;
      document_waterfalls();
   }
   if (item==1) {
      // sound
      if (usejavasound==usejava) return;
      usejavasound=usejava;
      var s=(usejavawaterfall?"y":"n")+(usejavasound?"y":"n");
      createCookie("usejava",s,3652);
      try { soundapplet.destroy(); } catch (e) {};
      document_soundapplet();
      document.getElementById('record_span').style.display= usejavasound ? "none" : "inline";
      html5javawarn();
   }
}

function checkjava()
{
   try {
      if (navigator.javaEnabled && navigator.javaEnabled()) return "green";
   } catch(e) {};
   try {
      var m=navigator.mimeTypes;
      for (i=0;i<m.length;i++)
         if (m[i].type.match(/^application\/x-java-applet/)) return "green";
      return "red";
   } catch(e) {};
   return "black";
}

/*
function iOS_audio_start()
{
   // Safari on iOS only plays webaudio after it has been started by clicking a button, so this function must be called from a button's onclick handler
   if (!document.ct) document.ct= new webkitAudioContext();
   var s = document.ct.createBufferSource();
   s.connect(document.ct.destination);
   try { s.start(0); } catch(e) { s.noteOn(0); }
}

function chrome_audio_start()
{
   // Chrome only plays webaudio after it has been started by clicking a button, so this function must be called from a button's onclick handler
   if (!document.ct) document.ct= new webkitAudioContext();
   var s = document.ct.createBufferSource();
   s.connect(document.ct.destination);
   document.ct.resume();
   try { s.start(0); } catch(e) { s.noteOn(0);}
}
*/

function html5orjavamenu()
{
   var s;
   if (sup_webaudio) {
      if (sup_webaudio) {
         if (!document['ct']) document['ct']= new sup_webaudio;
         try {
            var cc=document['ct'].createConvolver;
         } catch (e) {
            document['ct']=null; // firefox 23 supports webaudio, but not yet createConvolver(), making it unusable.
            sup_webaudio=false;
         };
      }
   }
   sup_iOS = 0;   // global!
   sup_android = 0;   // global!
   sup_chrome = 0;  // global!
   try {
      var n=navigator.userAgent.toLowerCase();
      if (n.indexOf('iphone')!=-1) sup_iOS=1;
      if (n.indexOf('ipad')!=-1) sup_iOS=1;
      if (n.indexOf('ipod')!=-1) sup_iOS=1;
      if (n.indexOf('ios')!=-1) sup_iOS=1;
      if (n.indexOf('android')!=-1) sup_android=1;
      if (n.indexOf('chrome')!=-1) sup_chrome=1;
   } catch (e) {};
   if (sup_iOS) isTouchDev=true;

   var usecookie= readCookie('usejava');
   if (!usecookie) {
      if (sup_socket && sup_canvas) usecookie="n"; else usecookie="y";
      if (sup_socket && (sup_webaudio || sup_mozaudio)) usecookie+="n"; else usecookie+="y";
   }
   usejavawaterfall=(usecookie.substring(0,1)=='y');
   usejavasound=(usecookie.substring(1,2)=='y');

   if (sup_socket && sup_canvas)
   {
    document.getElementById('html5-waterfall-status').classList.add('html5-status-ok');
   }
   else
   {
    document.getElementById('html5-waterfall-status').classList.add('html5-status-error');
   }

   if ((sup_socket && sup_webaudio) || (sup_socket && sup_mozaudio))
   {
    document.getElementById('html5-sound-status').classList.add('html5-status-warning');
//    checkAudioContextState();
   }
   else
   {
    document.getElementById('html5-sound-status').classList.add('html5-status-error');
   }

   document.getElementById("html5warning").style.display= (!sup_webaudio && !sup_mozaudio) ? "block" : "none";

//Retirado as opcoes de java audio e java waterfall (13/03/2021)

/*
   var javacolor=checkjava();

   s='<b>Espectro:</b>';
   s+='<span style="color: '+javacolor+'"><input type="radio" name="groupw" value="Java" onclick="html5orjava(0,1);"'+(usejavawaterfall?" checked":"")+'>Java</span>';
   if (sup_socket && sup_canvas) s+='<span style="color:green">'; else s+='<span style="color:red">';
   s+='<input type="radio" name="groupw" value="HTML5" onclick="html5orjava(0,0);"'+(!usejavawaterfall?" checked":"")+'>HTML5</span>';

   s+='&nbsp;&nbsp;&nbsp;<b>Audio:</b>';
   s+='<span style="color: '+javacolor+'"><input type="radio" name="groupa" value="Java" onclick="html5orjava(1,1);"'+(usejavasound?" checked":"")+'>Java</span>';
   if (sup_socket && sup_webaudio) s+='<span style="color: green">';
   else if (sup_socket && sup_mozaudio) s+='<span style="color: blue">';
   else s+='<span style="color: red">';
   s+='<input type="radio" name="groupa" value="HTML5" onclick="html5orjava(1,0);"'+(!usejavasound?" checked":"")+'>HTML5</span>';

   s='';
//   if (sup_iOS && sup_socket && sup_webaudio) s+='<input style="margin: 0 15px;" type="button" value="Iniciar audio" onclick="iOS_audio_start()">';
//   if (sup_chrome && sup_socket && sup_webaudio) s+='<input style="margin: 0 15px;" type="button" value="Iniciar audio" onclick="chrome_audio_start()">';
   if (sup_socket && sup_webaudio) s+='<input style="margin: 0 5px;" type="button" value="Iniciar audio" onclick="chrome_audio_start()">';
   document.getElementById('html5choice').innerHTML = s;
//   document.getElementById('record_span').style.display = usejavasound ? "none" : "inline";
*/
}


var audioPageStart = true
var audioContextRunning = false;
var audioContextTimer = null;

function checkAudioContextState()
{
  if(document['ct'])
  {
    document.getElementById("soundcontext").textContent = "HTML5 AudioContext State: " + document['ct'].state;
    if((audioContextRunning || audioPageStart) && document['ct'].state == 'suspended')
    {
      document.getElementById('html5-sound-status').classList.remove('html5-status-ok');
      document.getElementById('html5-sound-status').classList.add('html5-status-warning');
      document.getElementById('autoplay-start').style.display = "inline";
      audioContextRunning = false;
      audioPageStart = false;
    }
    else if((!audioContextRunning || audioPageStart) && document['ct'].state != 'suspended')
    {
      document.getElementById('autoplay-start').style.display = "none";
      document.getElementById('html5-sound-status').classList.remove('html5-status-warning');
      document.getElementById('html5-sound-status').classList.add('html5-status-ok');
      audioContextRunning = true;
      audioPageStart = false;
    }
  }
  if(audioContextTimer != null)
  {
    clearTimeout(audioContextTimer);
  }
  audioContextTimer = setTimeout(checkAudioContextState, 100);
}


function start_audio()
{
  if(sup_iOS)
  {
    // Safari on iOS only plays webaudio after it has been started by clicking a button, so this function must be called from a button's onclick handler
    if (!document.ct) document.ct = new webkitAudioContext();
    var s = document.ct.createBufferSource();
    s.connect(document.ct.destination);
    try { s.start(0); } catch(e) { s.noteOn(0); };
  }
  else
  {
    document['ct'].resume();
  }
  checkAudioContextState();
}

function bodyonload()
{
   var xhttp = new XMLHttpRequest();
   xhttp.open("GET","http://ip-api.com/csv?fields=countryCode,region,city", true);
   xhttp.send();
   xhttp.onreadystatechange = function()
     {
     if (xhttp.readyState == 4 && xhttp.status == 200) { geo = xhttp.responseText, document.getElementById('geoip').value = geo }
     else { document.getElementById('geoip').value = ("Sem localização") }
     }

   var s;

   html5orjavamenu();
   if ((sup_iOS || sup_android) && has_mobile) document.getElementById("mobilewarning").style.display= "block";

   view= readCookie('view');
   if (view==null) view=Views.oneband;
   if (nvbands>=2) s='<input type="radio" name="group" value="all bands" onclick="setview(0);">Todas as Bandas<input type="radio" name="group" value="others slow" onclick="setview(1);" >Outras lento<input type="radio" name="group" value="one band" onclick="setview(2);" >Uma Banda';
   else {
      s='<input type="radio" name="group" value="waterfall" onclick="setview(2);">waterfall';
      if (view==Views.othersslow || view==Views.allbands) view=Views.oneband;
   }
   s+='<input type="radio" name="group" value="blind" onclick="setview(3);" >Desativado';
   document.getElementById('viewformbuttons').innerHTML = s;
   if (nvbands>=2) document.viewform.group[view].checked=true;
   else document.viewform.group[view-2].checked=true;

   var x= readCookie('username');
   var p=document.getElementById("please2");
   if (!x && p) p.innerHTML="<b><i>Por favor digite seu nome e/ou indicativo no campo <a href='#please'>top of the page</a> para identificar suas mensagens no chat!</i></b>";

   uu_compactview=document.getElementById("compactviewcheckbox").checked;
   document.getElementById("mutecheckbox").checked=false;
   document.getElementById("squelchcheckbox").checked=false;
   document.getElementById("autonotchcheckbox").checked=false;

   try { memories=JSON.parse(localStorage.getItem('memories')); } catch (e) {};
   if (!memories) memories=[];
   else {
       // conversion from old data format - should be removed later
       var rew=false;
       for (i=0;i<memories.length;i++) {
          if (memories[i].mode==1) { memories[i].mode="AM"; rew=true; }
          if (memories[i].mode==4) { memories[i].mode="FM"; rew=true; }
          if (memories[i].mode==0) {
             rew=true;
             if (memories[i].hi-memories[i].lo<1) memories[i].mode="CW";
             else if (memories[i].hi+memories[i].lo>0) memories[i].mode="USB";
             else memories[i].mode="LSB";
          }
          if (!memories[i].nomfreq) memories[i].nomfreq=memories[i].freq + (memories[i].mode=="CW"?0.75:0);
       }
       if (rew) try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
   }

   passbandobj =document.getElementById('yellowbar');
   edgeupperobj = document.getElementById('edgeupper');
   edgelowerobj = document.getElementById('edgelower');
   edgeupperobj = document.getElementById('edgeupper');
   carrierobj = document.getElementById('carrier');
   smeterobj = document.getElementById('smeterbar');
   numericalsmeterobj=document.getElementById('numericalsmeter');
   smeterpeakobj = document.getElementById('smeterpeak');
   numericalsmeterpeakobj=document.getElementById('numericalsmeterpeak');
   smeterobj.style.top= smeterpeakobj.style.top;
   smeterobj.style.left= smeterpeakobj.style.left;

   mem_show();

   bi=bandinfo;
   for (i=0;i<nbands;i++) {
      var e=bi[i];
      e.realband=i;
      e.effcenterfreq=e.centerfreq;
      e.effsamplerate=e.samplerate;
      e.zoom=0;
      e.start=0;
      e.minzoom=0;
   }

   document.freqform.frequency.value=freq;
   if (nbands>1) document.freqform.group0[0].checked=true;

   html5javawarn();

   chatboxobj = document.getElementById('chatbox');

   uptimeobj = document.getElementById('uptime');
   statsobj = document.getElementById('stats');
   numusersobj = document.getElementById('numusers');
   usersobj = document.getElementById('users');

   setview(view);

   if (!islsbband(band) && hi<0) { var tmp=hi; hi=-lo; lo=-tmp; mode="USB"; }
   var tuneparam = (new RegExp("[?&]tune=([^&#]*)").exec(window.location.href));
   if (tuneparam) {
      setfreqtune(tuneparam[1]);
   } else if (ini_freq && ini_mode) {
      setfreqif(ini_freq);
      set_mode(ini_mode);
   }

   document_soundapplet();

   interval_ajax3 = setTimeout('ajaxFunction3()',1000);

   setTimeout('javatest()',2000);

   interval_updatesmeter = setInterval('updatesmeter()',100);

   if (isTouchDev) {
      registerTouchEvents("carrier", touchpassband, touchXYpassband);
      registerTouchEvents("yellowbar", touchpassband, touchXYpassband);
      registerTouchEvents("edgeupper", touchupper, touchXYupperedge);
      registerTouchEvents("edgelower", touchlower, touchXYloweredge);
   }
}

function registerTouchEvents(id, touchStart, touchMove) {
   var elem=document.getElementById(id);
   elem.addEventListener('touchstart', touchStart);
   elem.addEventListener('touchmove', touchMove);
   elem.addEventListener('touchend', touchEnd);
}

function setusernamecookie() {
   createCookie('username',document.usernameform.username.value,365*5);
   var p=document.getElementById("please1");
   if (p) p.innerHTML="Bem vindo! ";
   p=document.getElementById("please2");
   if (p) p.innerHTML="";
   send_soundsettings_to_server();
}

//----------------------------------------------------------------------------------------
// things related to interaction with the mouse (clicking & dragging on the frequency axes)

var dragging=false;
var dragorigX;
var dragorigval;
var touchingLower=false;

function getMouseXY(e)
{
   e = e || window.event;
   if (e.pageX || e.pageY) return {x:e.pageX, y:e.pageY};
   return {
     x:e.clientX + document.body.scrollLeft - document.body.clientLeft,
     y:e.clientY + document.body.scrollTop  - document.body.clientTop
   };
// from: http://www.webreference.com/programming/javascript/mk/column2/
}


function useMouseXY(e)
{
   var pos=getMouseXY(e);
   setfreq((pos.x-scaleobj.offsetParent.offsetLeft-512)*khzperpixel+centerfreq-(hi+lo)/2);
   return cancelEvent(e);
}

function touchXY(ev)
{
   ev.preventDefault();
   for (var i=0; i<ev.touches.length; i++) {
      var x = ev.touches[i].pageX;
      setfreq((x-scaleobj.offsetParent.offsetLeft-512)*khzperpixel+centerfreq-(hi+lo)/2);
   }
}

function useMouseXYloweredge(e)
{
   var pos=getMouseXY(e);
   lo=dragorigval+(pos.x-dragorigX)*khzperpixel;
   updbw();
   return cancelEvent(e);
}

function touchXYloweredge(ev)
{
   ev.preventDefault();
   for (var i=0; i<ev.touches.length; i++) {
      var x = ev.touches[i].pageX;
      lo=dragorigval+(x-dragorigX)*khzperpixel;
      updbw();
   }
}

function useMouseXYupperedge(e)
{
   var pos=getMouseXY(e);
   hi=dragorigval+(pos.x-dragorigX)*khzperpixel;
   updbw();
   return cancelEvent(e);
}

function touchXYupperedge(ev)
{
   ev.preventDefault();
   for (var i=0; i<ev.touches.length; i++) {
      var x = ev.touches[i].pageX;
      hi=dragorigval+(x-dragorigX)*khzperpixel;
      updbw();
   }
}

function useMouseXYpassband(e)
{
   var pos=getMouseXY(e);
   setfreq(dragorigval+(pos.x-dragorigX)*khzperpixel);
   return cancelEvent(e);
}

function touchXYpassband(ev)
{
   ev.preventDefault();
   for (var i=0; i<ev.touches.length; i++) {
      var x = ev.touches[i].pageX;
      setfreq(dragorigval+(x-dragorigX)*khzperpixel);
   }
}

function mouseup(e)
{
   if (dragging) {
      dragging=false;
      document.onmousemove(e);
      document.onmousemove = null;
   }
}

function touchEnd(ev) {
   ev.preventDefault();
   if (dragging) {
      dragging=false;
      touchingLower=false;
   }
}

function imgmousedown(ev,bb)
{
   var b=id2band(bb);
   dragging=true;
   document.onmousemove = useMouseXY;
   if (view!=Views.oneband && band!=b) {
      if (view==Views.othersslow) waterfallspeed(waterslowness);
      setband(b);
      useMouseXY(ev);
   }
}

function imgtouch(ev) {
   ev.preventDefault();
   
   // recover waterfall instance number from event target
   // is there a better way to do this?
   var e = ev || window.event;
   var img;
   if (e.target) img = e.target; else
   if (e.srcElement) img = e.srcElement;
   if (img.nodeType == 3) img = img.parentNode;
   var bb=0;
   if (img.name) bb = img.name.substring(6,7); else	// name="sncale[bb]" from HTML below
   if (img.id) bb = img.id.substring(8,9);		// id="blackbar[bb]" from HTML below

   var b=id2band(bb);
   if (view!=Views.oneband && band!=b) {
      if (view==Views.othersslow) waterfallspeed(waterslowness);
      setband(b);
   }

   if (ev.targetTouches.length == 1) {
      dragging=true;
      dragorigX=ev.targetTouches[0].pageX;
      touchXY(ev);
   }
}

function mousedownlower(ev)
{
   var pos=getMouseXY(ev);
   dragging=true;
   document.onmousemove = useMouseXYloweredge;
   dragorigX=pos.x;
   dragorigval=lo;
   return cancelEvent(ev);
}

function touchlower(ev) {
   ev.preventDefault();
   if (ev.targetTouches.length == 1) {
      touchingLower=true;
      dragging=true;
      dragorigX=ev.targetTouches[0].pageX;
      dragorigval=lo;
   }
}

function mousedownupper(ev)
{
   var pos=getMouseXY(ev);
   dragging=true;
   document.onmousemove = useMouseXYupperedge;
   dragorigX=pos.x;
   dragorigval=hi;
   return cancelEvent(ev);
}

function touchupper(ev) {
   ev.preventDefault();
   if (ev.targetTouches.length == 1) {
      dragging=true;
      dragorigX=ev.targetTouches[0].pageX;
      dragorigval=hi;
   }
}

function mousedownpassband(ev)
{
   var pos=getMouseXY(ev);
   dragging=true;
   document.onmousemove = useMouseXYpassband;
   dragorigX=pos.x;
   dragorigval=freq;
   return cancelEvent(ev);
}

function touchpassband(ev) {
   ev.preventDefault();
   if (ev.targetTouches.length == 1) {
      dragging=true;
      dragorigX=ev.targetTouches[0].pageX;
      dragorigval=freq;
   }
}


function docmousedown(ev)
{
   var fobj;
   if (!ev) fobj=event.srcElement;  // IE
   else fobj = ev.target;  // FF
   if (fobj.className == "scale" || fobj.className=="scaleabs") return cancelEvent(ev);
   return true;
}


var tprevwheel=0;
var prevdir=0;
var wheelstep=1000;
function mousewheel(ev)
{
   var fobj;
   // Win7/IE9 seems to have fixed the problem where 'ev' is null if not called directly, i.e. mousewheel(event)
   if (!ev) { 
      ev=window.event; fobj=event.srcElement;	// IE
   }
   else fobj = ev.target;	// FF or IE9

   // In IE and Win7/Chrome the wheel event is not automatically passed on to the Java applet.
   // This check will handle the mouse wheel event for any browser running on Windows (not just IE and Chrome)
   // and hopefully that will not be a problem.
   if (navigator.platform.substring(0,3)=="Win" && fobj.tagName=='APPLET' && fobj.name.substring(0,15)=="waterfallapplet") {
         var pos=getMouseXY(ev);
         var x=pos.x-fobj.offsetParent.offsetLeft;
         // scrollwheel while on the waterfallapplet; only needed in IE/Chrome because FF always passes these events on to the java applet
         if (ev.wheelDelta>0) document[fobj.name].setzoom(-2, x);
         else if (ev.wheelDelta<0) document[fobj.name].setzoom(-1, x);
         return cancelEvent(ev);
   }

   // this is needed for Mac/Safari and {Mac,Linux,Win7}/Chrome when positioned on the text of a dx label
   if (fobj.nodeType==3) fobj=fobj.parentNode;	// 3=TEXT_NODE, i.e. text inside of a <div>

   if (fobj.className == "scale" || fobj.className=="scaleabs" || fobj.className.substring(0,8) == "statinfo") {
      // this is for tuning using the scroll wheel when positioned on the tuning scale
      var delta = ev.detail ? ev.detail : ev.wheelDelta/-40;
      var t=new Date().getTime();
      var dt=t-tprevwheel;
      if (dt<10) dt=10;
      tprevwheel=t;
      prevdir=delta; 
      if (Math.abs(delta)<wheelstep && delta!=0) wheelstep=Math.abs(delta);
      delta/=wheelstep;
      if (prevdir*delta>0 && dt<500) delta*=(500./dt);
      setfreq(freq-delta/20);
      return cancelEvent(ev);
   }

   return true;
}

if (document.addEventListener) {
  window.addEventListener('DOMMouseScroll', mousewheel, false);
  document.addEventListener('mousewheel', mousewheel, false);
//  document.addEventListener('wheel', mousewheel, false);    // note: "modern" browsers are supposed to use this event, but it seems to be incompatible with the old ones, and for now we'll have to support those anyway...
  window.addEventListener('mouseup', mouseup, false);
  window.addEventListener('mousedown', docmousedown, false);
} else {
  window.onmousewheel = mousewheel;
  document.onmousewheel = mousewheel;
  document.onmouseup = mouseup;
  document.onmousedown = docmousedown;
}


//----------------------------------------------------------------------------------------
// direct control using keyboard:
var allowkeyboard;

function keydown(e)
{
   if (!document.viewform.allowkeys.checked) return true;
   e = e ? e : window.event;
   if (!e.target) e.target = e.srcElement;
   if (e.target.nodeName=="INPUT" && e.target.type=="text" && e.target.name!="frequency") return true;  // don't intercept keys when typing in one of the text fields, except the frequency field
   var st=1;
   if (e.shiftKey) st=2;
   if (e.ctrlKey || e.altKey || e.metaKey) st=3;
   switch (e.keyCode) {
      case 37:                                                         // left arrow
      case 74: freqstep(-st);                return cancelEvent(e);    // J
      case 39:                                                         // right arrow
      case 75: freqstep(st);                 return cancelEvent(e);    // K
      case 65: setmf ('am',  -4  ,  4  );    return cancelEvent(e);    // A
      case 70: setmf ('fm',  -6  ,  6  );    return cancelEvent(e);    // F
      case 67: setmf ('cw', -0.95, -0.55);   return cancelEvent(e);    // C
      case 76: setmf('lsb', -2.7, -0.3);     return cancelEvent(e);    // L
      case 85: setmf('usb',  0.3,  2.7);     return cancelEvent(e);    // U
      case 90: if (e.shiftKey) wfset(2); else wfset(4); return cancelEvent(e);   // Z
      case 71: document.freqform.frequency.value=""; document.freqform.frequency.focus(); return cancelEvent(e);    // G
      case 66: if (e.shiftKey) setband((band-1+nbands)%nbands);        // B
               else setband((band+1)%nbands);  
               return cancelEvent(e);
   }
   return true;
}

window.onkeydown = keydown;

//----------------------------------------------------------------------------------------
// functions that create part of the HTML GUI

function visit(tmpid) {
  document.getElementById(tmpid).value = document.getElementById(tmpid).value + " "+geo;
  document.usernameform.username.value = document.getElementById(tmpid).value;
}

function newid(tmpid) {
  document.getElementById(tmpid).value = document.getElementById(tmpid).value + " "+geo;
  document.usernameform.username.value = document.getElementById(tmpid).value;
}

function document_username()

{
  var x= readCookie('username');
  if (x) {
    document.write('<span id="please"> Bem vindo! ');
    document.write('<input type="text" id="visited" class="redcolor" style="text-align:center; width:215px;" name="username" value="" ondragstart="return false" ondrop="return false" ondrag="return false" onpaste="return false" onfocus=this.value="" onblur="visit(this.id); setusernamecookie();" onclick=""></span>');
    document.addEventListener("keyup", function(event) { event.preventDefault(); if (event.keyCode == 13) {document.getElementById("visited").blur();}});
    document.usernameform.username.value=x;
  } else {
    document.write('<span id="please"><span id="please1"><b><i>Por favor digite seu nome ou indicativo: <\/i><\/b></span> ');
    document.write('<input type="text" id="geoip" style="text-align:center; width:200px;" name="username" ondragstart="return false" ondrop="return false" ondrag="return false" onpaste="return false" maxlength="10" onfocus=this.value="" onblur="visit(this.id); setusernamecookie();" onclick=""></span>');
    document.addEventListener("keyup", function(event) { event.preventDefault(); if (event.keyCode == 13) {document.getElementById("geoip").blur();}});
  }
}


function document_waterfalls()
{
  if (view==Views.allbands || view==Views.othersslow) nwaterfalls=nvbands;
  else if (view==Views.oneband) nwaterfalls=1;
  else {
     nwaterfalls=0;
     document.getElementById('waterfalls').innerHTML="";
     return;
  }

  var i;
  var b;
  var s="";
  for (i=0;i<nwaterfalls;i++) {
    b = id2band(i);
    e=bi[b];
    j=e.realband;
    s+=
      '<div id="wfdiv'+i+'"></div>'+
      '<div class="scale" style="overflow:hidden; width:1024px; height:'+scaleheight+'px; position:relative" title="Clique para sintonizar" id="clipscale'+i+'" onmousedown="return false">' +
        '<img src="'+e.scaleimgs[0]+'" onmousedown="imgmousedown(event,'+i+')" class="scaleabs" style="top:0px" name="s0cale'+i+'">' +
        '<img src="'+e.scaleimgs[0]+'" onmousedown="imgmousedown(event,'+i+')" class="scaleabs" style="top:0px" name="s1cale'+i+'">' +
      '</div>' +
      '<div class="scale" style="width:1024px;height:30px;background-color:black;position:relative;" id="blackbar'+i+'" title="Clique para sintonizar" onmousedown="imgmousedown(event,'+i+')"><\/div>' +
      '\n';
     waterfallapplet[i]={};
     waterfallapplet[i].div='wfdiv'+i;
     waterfallapplet[i].id=i;
     waterfallapplet[i].band=b;
     waterfallapplet[i].maxzoom=bi[b].maxzoom;
  }

  waitingforwaterfalls=nwaterfalls;     // this must be before the next line, to prevent a race
  document.getElementById('waterfalls').innerHTML=s;

  if (usejavawaterfall) {
     if (typeof prep_javawaterfalls =="function") prep_javawaterfalls();
     else {
       script = document.createElement('script');
       script.src = 'websdr-javawaterfall.js';
       script.type = 'text/javascript';
       document.body.appendChild(script);
     }
  } else {
     if (typeof prep_html5waterfalls =="function") prep_html5waterfalls();
     else {
       script = document.createElement('script');
       script.src = 'websdr-waterfall.js';
       script.type = 'text/javascript';
       document.body.appendChild(script);
     }
  }

  for (i=0;i<nwaterfalls;i++) {
    scaleobjs[i] = document.getElementById('clipscale'+i);
    scaleimgs0[i] = document.images["s0cale"+i];
    scaleimgs1[i] = document.images["s1cale"+i];
    if (isTouchDev) {
       registerTouchEvents('clipscale'+i, imgtouch, touchXY);
       registerTouchEvents('blackbar'+i, imgtouch, touchXY);
    }
  }

}


function document_bandbuttons() {
    if (nvbands>1) {
       document.write("<b>Banda: </b>")
       var i;
       for (i=0;i<nbands;i++) document.write ("<td><input type=\"button\" name=\"group0\" id=\"btnB-" + i + "\" value=\""+bandinfo[i].name+"\" style=\"width:45px;\" onclick=\"setband("+i+")\"></td>\n");
       document.write("</tr></table>")
    }
}


function document_soundapplet() {
  if (usejavasound) {
     if (typeof prep_javasound =="function") prep_javasound();
     else {
       script = document.createElement('script');
       script.src = 'websdr-javasound.js';
       script.type = 'text/javascript';
       document.body.appendChild(script);
     }
  } else {
     if (typeof prep_html5sound =="function") prep_html5sound();
     else {
       script = document.createElement('script');
       script.src = 'websdr-sound.js';
       script.type = 'text/javascript';
       document.body.appendChild(script);
     }
  }
}



//----------------------------------------------------------------------------------------
// recording

var rec_showtimer;
var rec_downloadurl;

function record_show()
{
   document.getElementById('reccontrol').innerHTML=Math.round(soundapplet.rec_length_kB())+" kB";
}

function record_start() { 
   document.getElementById('reccontrol').innerHTML=0+" kB";
   if (rec_downloadurl) { URL.revokeObjectURL(rec_downloadurl); rec_downloadurl=null; }
   rec_showtimer=setInterval('record_show()',250);
   soundapplet.rec_start(); 
}

function record_stop()
{
   clearInterval(rec_showtimer);
   var res = soundapplet.rec_finish();

   var wavhead = new ArrayBuffer(44);
   var dv=new DataView(wavhead);
   var i=0;
   var sr=Math.round(res.sr);
   dv.setUint8(i++,82);  dv.setUint8(i++,73); dv.setUint8(i++,70); dv.setUint8(i++,70); // RIFF  (is there really no less verbose way to initialize this thing?)
   dv.setUint32(i,res.len+44,true); i+=4;  // total length; WAV files are little-endian
   dv.setUint8(i++,87);  dv.setUint8(i++,65); dv.setUint8(i++,86); dv.setUint8(i++,69); // WAVE
   dv.setUint8(i++,102);  dv.setUint8(i++,109); dv.setUint8(i++,116); dv.setUint8(i++,32); // fmt
     dv.setUint32(i,16,true);   i+=4;   // length of fmt
     dv.setUint16(i,1,true);    i+=2;   // PCM
     dv.setUint16(i,1,true);    i+=2;   // mono
     dv.setUint32(i,sr,true);   i+=4;   // samplerate
     dv.setUint32(i,2*sr,true); i+=4;   // 2*samplerate
     dv.setUint16(i,2,true);    i+=2;   // bytes per sample
     dv.setUint16(i,16,true);   i+=2;   // bits per sample
   dv.setUint8(i++,100);  dv.setUint8(i++,97); dv.setUint8(i++,116); dv.setUint8(i++,97); // data
     dv.setUint32(i,res.len,true);  // length of data

   var wavdata = res.wavdata;
   wavdata.unshift(wavhead);

   var mimetype = 'application/binary';
   var bb = new Blob(wavdata, {type: mimetype});
   if (!bb) document.getElementById('recwarning').style.display="block";
   rec_downloadurl = window.URL.createObjectURL(bb);
   if (rec_downloadurl.indexOf('http')>=0) document.getElementById('recwarning').style.display="block";
   var fname='';
   try {
      fname=(new Date().toISOString()).replace(/\.[0-9]{3}/,"");
   } catch (e) {};
   fname="websdr_volta_redonda_"+fname+"_"+nominalfreq().toFixed(1)+"kHz.wav";
   document.getElementById('reccontrol').innerHTML="<a href='"+rec_downloadurl+"' download='"+fname+"'>download</a>";
}

function record_click()
{
   var bt=document.getElementById('recbutton');
   if (bt.innerHTML=="parar") {
      bt.innerHTML="iniciar";
      record_stop();
   } else {
      bt.innerHTML="parar";
      record_start();
   }
}



//----------------------------------------------------------------------------------------
// things not directly related to the SDR: chatbox, logbook

function sendchat()
{
  timeout_idle_restart()
  var xmlHttp;
  try { xmlHttp=new XMLHttpRequest(); }
    catch (e) { try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e) { try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { alert("Seu browser não possui suporte ao AJAX!"); return false; } } }
  var url="/~~chat";
  var msg=encodeURIComponent(document.chatform.chat.value);
  url=url+"?name="+encodeURIComponent(document.usernameform.username.value)+"&msg="+encodeURIComponent(document.chatform.chat.value);
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
  document.chatform.chat.value="";
  return false;
}

function chatnewline(s)
// called by updates fetched from the server
{
  var o=document.getElementById('chatboxnew');
  if (!o) return;
  if (s[0]=='-') {
     // remove line from chatbox
     var div=document.createElement('div');
     div.innerHTML=s;
     s=div.innerHTML;
     var re=new RegExp('<br>'+s.substring(1).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")+'.*','g');
     o.innerHTML=o.innerHTML.replace(re,'<br>');
     return;
  }
  // add line to chatbox
  o.innerHTML+='<br>'+s+'\n';
  o.scrollTop=o.scrollHeight;
}

function sendlogclear()
{
  document.logform.comment.value="";
}

function sendlog()
{
  var xmlHttp;
  try { xmlHttp=new XMLHttpRequest(); }
    catch (e) { try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e) { try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { alert("Seu browser não possui suporte ao AJAX!"); return false; } } }
  var url="/~~loginsert";
  url=url
     +"?name="+encodeURIComponent(document.usernameform.username.value)
     +"&freq="+nominalfreq()
     +"&call="+encodeURIComponent(document.logform.call.value)
     +"&comment="+encodeURIComponent(document.logform.comment.value)
     ;
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
  document.logform.call.value="";
  document.logform.comment.value="";
  xmlHttp.onreadystatechange=function()
    {
    if(xmlHttp.readyState==4)
      {
      document.logform.comment.value=xmlHttp.responseText;
      }
    }
  setTimeout("document.logform.comment.value=''",1000);
  return false;
}

//*****************************************************************************************************************//
//Configurações de tempo do servidor up e de sessão de usuário 24/11/2019

// Server uptime
function uptime()
{
  if (window.XMLHttpRequest) {
    xmlhttp=new XMLHttpRequest();
  }
  else {
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.open("GET","uptime.xml",false);
  xmlhttp.send();
  xmlDoc = xmlhttp.responseXML;

  var xmlDate=xmlDoc.getElementsByTagName("date")[0].childNodes[0].nodeValue;
  var xmlTime=xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;

  var startDate = new Date(xmlDate + " " + xmlTime).getTime();
  var x = setInterval(function() {
    // Get todays date and time
    var now = new Date().getTime();
    // Find the distance between now and the start date
    var upTime = now - startDate;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(upTime / (1000 * 60 * 60 * 24));
    var hours = Math.floor((upTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((upTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((upTime % (1000 * 60)) / 1000);
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    if (minutes < 10 ) {
        minutes = "0" + minutes
    }
    // Output the result in an element with id="uptime"
    document.getElementById("uptime").innerHTML = "Process started: " + xmlDate + " " + xmlTime + "; Uptime: " + days + " day " + hours + " hrs " + minutes + " min " + seconds + " sec ";
//    settings_store();
  }, 1000);
}


function sessionTime()
{
  occloop = setInterval(function() // initialise 1 second loop (one sample every 1000mS - ie: 1 samples/second)
  {
    samplecount = samplecount + 1;
    windowsecs = parseInt(samplecount % 60);
    windowhours = parseInt(samplecount / 3600);
    windowmins = parseInt((samplecount % 3600) / 60);
//    time_out = time_out - parseInt(((samplecount - timeout_secs) % 3600) / 60);
    document.getElementById("conTime").innerHTML = windowhours + " hrs " + windowmins + " min " + windowsecs + " seg" // creates session time for display
    if (idletimeout){
      document.getElementById("idleTime").innerHTML = (time_out - parseInt(((samplecount - timeout_secs) % (idletimeout / 1000)) / 60)) + " min"; // creates idletime counter for display
    }
    }, 1000); // sets timing loop duration in mS
}

