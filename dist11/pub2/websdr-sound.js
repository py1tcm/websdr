//WebSDR HTML5 client side - Copyright 2013-2018, pa3fwm@websdr.org - all rights reserved
//Since the intended use of this code involves sending a copy to the client computer, I (PA3FWM) hereby allow making it available unmodified, via my original WebSDR server software, to original WebSDR clients. Other use, including distribution in part or entirety or as part of other software, or reverse engineering, is not allowed without my explicit prior permission.
// Modifications including de-emphasis and additional filtering (HPF, LPF, LMS, notch) made by Clint, KA7OEI, March 2020, with the knowledge of the original author

var dtemp=0;!function(){var e=null,t=window.AudioContext||window.webkitAudioContext;if(t){var n;document.ct||(document.ct=new t);try{n=document.ct.createConvolver}catch(e){}n||(document.ct=e,sup_webaudio=!1)}var r=32768,o=0;function a(){function n(e){var t=e.outputBuffer.getChannelData(0),n=e.outputBuffer.length;for(at=n,V++,e=0;e<n;e++){var a=p[v],s=y*g/b;if(1<=(w+=s)){w-=1,p[v]=0,++v>=r&&(v-=r);var i=p[v];W&&(a=(w*i+(s-w)*a)/s)}Te=2e-5*a*_,Math.abs(Te)<1e-8&&(0!=o?(Te=1e-5,o=0):(Te=-1e-5,o=1)),"FM"==Se?(xe=ke=xe+ve*(Te-xe),ze=ie*(Ee=ke)+Ie-ue*(Ne=Ee*se+ze),Ie=Ee*ce-le*Ne,Pe=ie*(Fe=Ne)+We-ue*(He=Fe*se+Pe),We=Fe*ce-le*He,Le=ie*(qe=He)+Re-ue*(Ve=qe*se+Le),Re=qe*ce-le*Ve,ae=Ve*ne):ae=Te,b<=12e3?oe=ae:(Oe=fe*(je=ae)+Ue-pe*(Ke=je*de+Oe),Ue=je*he-me*Ke,Qe=fe*(re=Ke)+Xe-pe*(oe=re*de+Qe),Xe=re*he-me*oe),Ze=(Ye=oe)*ha0+$e,$e=we*Ye+et-be*Ze,et=Ye*ge-ye*Ze,ae=Ze,0!=Je&&(rt=Me*(tt=ae)+ot-Be*(nt=tt*_e+rt),ot=tt*Ae-Ce*nt,ae=nt),ae<-1?ae=-1:ae>1&&(ae=1),0!=Ge&&0==Ft?Tt[e]=ae:0!=Ge&&0!=Ft?Tt[e]=ae:0==Ge&&0!=Ft?Rt[e]=ae:t[e]=ae,dtemp=ae}if(0==Ge?Dt=0:0==Dt&&(At<=0&&(At=bt),Bt<=0&&(Bt=yt),st=Bt,Ct<=0&&(Ct=_t),ut=Ct,At>Mt&&(At=Mt),it=At,ct=0,Dt=1),0==Ft?Wt=0:0==Wt&&(Et<=0&&(Et=St),Nt<=0&&(Nt=zt),ft=Nt,Pt<=0&&(Pt=It),mt=Pt,Et>Mt&&(Et=Mt),ht=Et,pt=0,Wt=1),0!=Ge&&0!=Dt)for(var c=0;c<at;c++){var u=Tt[c]/_;kt[ct]=u,it+gt==ct?ct=0:ct++;for(var l=0,d=0;d<wt;d++)l+=kt[ct]*xt[d],it+gt==ct?ct=0:ct++;0==ct?ct=it+gt:ct--,err_lms_notch=u-l,0==Ft?t[c]=err_lms_notch*_:Rt[c]=err_lms_notch*_,err2_notch=err_lms_notch*st;for(d=gt;d>=0;d--)lt=kt[ct]*err2_notch+xt[d]*ut,xt[d]=lt,0==ct?ct=it+gt:ct--;it+gt==ct?ct=0:ct++}if(0!=Ft)for(var f=0;f<at;f++){var h=Rt[f]/_;Ht[pt]=h,ht+gt==pt?pt=0:pt++;l=0;for(var m=0;m<wt;m++)l+=Ht[pt]*Lt[m],(isNaN(l)||Math.abs(l)>500)&&(l=0),ht+gt==pt?pt=0:pt++;0==pt?pt=ht+gt:pt--,err_lms_noise=h-l,t[f]=l*dt*_,err2_noise=err_lms_noise*ft;for(m=gt;m>=0;m--)vt=Ht[pt]*err2_noise+Lt[m]*mt,(isNaN(vt)||Math.abs(vt>500))&&(vt=0),Lt[m]=vt,0==pt?pt=ht+gt:pt--;ht+gt==pt?pt=0:pt++}L=(new Date).getTime(),e=(new Date).getTime(),R&&((n=e-R)>q&&(q=n)),R=e,U&&0==t[0]&&G++}document.getElementById("soundappletdiv").innerHTML='<div onclick="var e=document.getElementById(\'soundappletdebug\'); e.style.display=(e.style.display==\'none\')?\'block\':\'none\';" style="max-width:400px; min-height:50px; border-style:solid; border-color:black; background-color:white; color:black; border-width:1px; margin:2px; padding:2px; /*font-family:sans-serif;*/ font-size:70%;">WebSDR HTML5 sound - Copyright 2007-2018, P.T. de Boer, pa3fwm@websdr.org<br>GUI and config customizations 2019-2021, Cleber, py1tcm@yahoo.com.br<br><span id="soundappletdebug" style="display:none"></span></div><span id="debug2"></span>';var a,s,i,c,u,l,d,f,h,p=new Int16Array(r),m=0,v=6144,w=0,g=8e3,b=48e3,y=1,_=1,M=-1,A=0,B=[],C=this,D=e,k=0,x=[-5504,-5248,-6016,-5760,-4480,-4224,-4992,-4736,-7552,-7296,-8064,-7808,-6528,-6272,-7040,-6784,-2752,-2624,-3008,-2880,-2240,-2112,-2496,-2368,-3776,-3648,-4032,-3904,-3264,-3136,-3520,-3392,-22016,-20992,-24064,-23040,-17920,-16896,-19968,-18944,-30208,-29184,-32256,-31232,-26112,-25088,-28160,-27136,-11008,-10496,-12032,-11520,-8960,-8448,-9984,-9472,-15104,-14592,-16128,-15616,-13056,-12544,-14080,-13568,-344,-328,-376,-360,-280,-264,-312,-296,-472,-456,-504,-488,-408,-392,-440,-424,-88,-72,-120,-104,-24,-8,-56,-40,-216,-200,-248,-232,-152,-136,-184,-168,-1376,-1312,-1504,-1440,-1120,-1056,-1248,-1184,-1888,-1824,-2016,-1952,-1632,-1568,-1760,-1696,-688,-656,-752,-720,-560,-528,-624,-592,-944,-912,-1008,-976,-816,-784,-880,-848,5504,5248,6016,5760,4480,4224,4992,4736,7552,7296,8064,7808,6528,6272,7040,6784,2752,2624,3008,2880,2240,2112,2496,2368,3776,3648,4032,3904,3264,3136,3520,3392,22016,20992,24064,23040,17920,16896,19968,18944,30208,29184,32256,31232,26112,25088,28160,27136,11008,10496,12032,11520,8960,8448,9984,9472,15104,14592,16128,15616,13056,12544,14080,13568,344,328,376,360,280,264,312,296,472,456,504,488,408,392,440,424,88,72,120,104,24,8,56,40,216,200,248,232,152,136,184,168,1376,1312,1504,1440,1120,1056,1248,1184,1888,1824,2016,1952,1632,1568,1760,1696,688,656,752,720,560,528,624,592,944,912,1008,976,816,784,880,848],T=[.0084619,36183e-8,20264e-8,-48621e-9,-36771e-8,-70991e-8,-.0010355,-.0012935,-.0014506,-.0014733,-.0013571,-.0011019,-74253e-8,-30836e-8,1358e-7,56517e-8,88996e-8,.0010664,.0010912,92941e-8,60906e-8,15494e-8,-37203e-8,-91186e-8,-.001389,-.0017416,-.0019133,-.0018764,-.0016225,-.0011768,-58255e-8,92361e-9,75528e-8,.0013306,.0017366,.0019135,.0018299,.0014834,90902e-8,16944e-8,-64513e-8,-.0014333,-.0020901,-.002526,-.0026728,-.0024998,-.0020096,-.0012556,-32129e-8,68312e-8,.0016291,.0023941,.0028705,.0029846,.002705,.0020504,.0010884,-70093e-9,-.0012848,-.0024011,-.0032709,-.0037692,-.0038134,-.0033791,-.0024966,-.0012601,18871e-8,.0016733,.0030042,.0040027,.0045239,.0044775,.0038421,.0026705,.0010869,-72511e-8,-.0025439,-.0041336,-.0052788,-.0058077,-.0056185,-.0046979,-.0031235,-.0010625,.0012472,.0035218,.005466,.0068099,.0073449,.0069525,.0056265,.0034784,73321e-8,-.0022942,-.005233,-.007697,-.0093357,-.0098779,-.0091724,-.0072151,-.0041599,-31209e-8,.0038988,.007962,.011341,.013538,.014156,.012956,.0099028,.0051811,-7971e-7,-.0074221,-.013934,-.019491,-.023251,-.024456,-.02252,-.017099,-.0081382,.0040987,.019038,.035829,.053411,.070595,.086169,.098999,.10813,.11288,.11288,.10813,.098999,.086169,.070595,.053411,.035829,.019038,.0040987,-.0081382,-.017099,-.02252,-.024456,-.023251,-.019491,-.013934,-.0074221,-7971e-7,.0051811,.0099028,.012956,.014156,.013538,.011341,.007962,.0038988,-31209e-8,-.0041599,-.0072151,-.0091724,-.0098779,-.0093357,-.007697,-.005233,-.0022942,73321e-8,.0034784,.0056265,.0069525,.0073449,.0068099,.005466,.0035218,.0012472,-.0010625,-.0031235,-.0046979,-.0056185,-.0058077,-.0052788,-.0041336,-.0025439,-72511e-8,.0010869,.0026705,.0038421,.0044775,.0045239,.0040027,.0030042,.0016733,18871e-8,-.0012601,-.0024966,-.0033791,-.0038134,-.0037692,-.0032709,-.0024011,-.0012848,-70093e-9,.0010884,.0020504,.002705,.0029846,.0028705,.0023941,.0016291,68312e-8,-32129e-8,-.0012556,-.0020096,-.0024998,-.0026728,-.002526,.0035218,.0012472,-.0010625,-.0031235,-.0046979,-.0056185,-.0058077,-.0052788,-.0041336,-.0025439,-72511e-8,.0010869,.0026705,.0038421,.0044775,.0045239,.0040027,.0030042,.0016733,18871e-8,-.0012601,-.0024966,-.0033791,-.0038134,-.0037692,-.0032709,-.0024011,-.0012848,-70093e-9,.0010884,.0020504,.002705,.0029846,.0028705,.0023941,.0016291,68312e-8,-32129e-8,-.0012556,-.0020096,-.0024998,-.0026728,-.002526,-.0020901,-.0014333,-64513e-8,16944e-8,90902e-8,.0014834,.0018299,.0019135,.0017366,.0013306,75528e-8,92361e-9,-58255e-8,-.0011768,-.0016225,-.0018764,-.0019133,-.0017416,-.001389,-91186e-8,-37203e-8,15494e-8,60906e-8,92941e-8,.0010912,.0010664,88996e-8,56517e-8,1358e-7,-30836e-8,-74253e-8,-.0011019,-.0013571,-.0014733,-.0014506,-.0012935,-.0010355,-70991e-8,-36771e-8,-48621e-9,20264e-8,36183e-8,.0084619],S=[-60729e-8,.005547,.0012025,55133e-8,16992e-8,-23195e-8,-59426e-8,-82206e-8,-84752e-8,-65061e-8,-26977e-8,20642e-8,65721e-8,96247e-8,.001032,83416e-8,40395e-8,-15769e-8,-71117e-8,-.0011087,-.0012377,-.0010475,-57139e-8,82522e-9,75058e-8,.001259,.001464,.0012963,77829e-8,28808e-9,-76962e-8,-.0014083,-.001713,-.0015833,-.001033,-18129e-8,76089e-8,.0015551,.0019797,.0019098,.0013313,37702e-8,-72555e-8,-.0016986,-.0022625,-.0022768,-.0016922,-63215e-8,6491e-7,.0018212,.002576,.0026933,.0021119,94722e-8,-52351e-8,-.0019315,-.0029037,-.0031646,-.002609,-.0013427,33954e-8,.0020171,.0032517,.0036965,.003196,.0018324,-80558e-9,-.0020711,-.0036212,-.004303,-.0038921,-.0024398,-27089e-8,.0020837,.0040178,.0050015,.0047273,.003197,74395e-8,-.0020419,-.0044463,-.0058212,-.0057441,-.0041549,-.0013781,.0019266,.004923,.0068105,.0070197,.0053925,.0022394,-.00171,-.0054734,-.0080484,-.0086754,-.0070524,-.0034446,.001345,.0061452,.0096921,.010951,.009402,.0052149,-73621e-8,-.0070399,-.012063,-.014353,-.013025,-.0080465,-32853e-8,.0084029,.015957,.020176,.019477,.013318,.0024682,-.010997,-.023996,-.032993,-.034705,-.026822,-.0085825,.018925,.052806,.088761,.12179,.14705,.16074,.16074,.14705,.12179,.088761,.052806,.018925,-.0085825,-.026822,-.034705,-.032993,-.023996,-.010997,.0024682,.013318,.019477,.020176,.015957,.0084029,-32853e-8,-.0080465,-.013025,-.014353,-.012063,-.0070399,-73621e-8,.0052149,.009402,.010951,.0096921,.0061452,.001345,-.0034446,-.0070524,-.0086754,-.0080484,-.0054734,-.00171,.0022394,.0053925,.0070197,.0068105,.004923,.0019266,-.0013781,-.0041549,-.0057441,-.0058212,-.0044463,-.0020419,74395e-8,.003197,.0047273,.0050015,.0040178,.0020837,-27089e-8,-.0024398,-.0038921,-.004303,-.0036212,-.0020711,-80558e-9,.0018324,.003196,.0036965,.0032517,.0020171,33954e-8,-.0013427,-.002609,-.0031646,-.0029037,-.0019315,-52351e-8,94722e-8,.0021119,.0026933,.002576,.0018212,6491e-7,-63215e-8,-.0016922,-.0022768,-.0022625,-.0016986,-72555e-8,37702e-8,.0013313,.0019098,.0019797,.0015551,76089e-8,-18129e-8,-.001033,-.0015833,-.001713,-.0014083,-76962e-8,28808e-9,77829e-8,.0012963,.001464,.001259,75058e-8,82522e-9,-57139e-8,-.0010475,-.0012377,-.0011087,-71117e-8,-15769e-8,40395e-8,83416e-8,.001032,96247e-8,65721e-8,20642e-8,-26977e-8,-65061e-8,-84752e-8,-82206e-8,-59426e-8,-23195e-8,16992e-8,55133e-8,.0012025,.005547,-60729e-8],z=[-.0057279,-355e-6,-34657e-8,-32265e-8,-28568e-8,-23281e-8,-1673e-7,-86773e-9,44005e-10,10817e-8,21895e-8,33872e-8,46081e-8,589e-6,71566e-8,85449e-8,96872e-8,.0010826,.0011887,.0012785,.0013539,.0014097,.0014451,.0014572,.0014449,.0014071,.0013429,.001253,.0011363,9944e-7,82476e-8,63679e-8,4284e-7,20073e-8,-3878e-8,-28944e-8,-54502e-8,-80225e-8,-.0010553,-.0012998,-.0015302,-.001742,-.00193,-.0020897,-.0022163,-.0023046,-.0023534,-.0023594,-.0023179,-.0022306,-.0020944,-.0019112,-.0016809,-.0014065,-.0010903,-73703e-8,-3507e-7,62545e-9,49677e-8,94413e-8,.0013968,.001847,.0022869,.0027056,.0030964,.003449,.0037558,.0040081,.0041989,.0043211,.0043693,.0043381,.0042245,.0040256,.0037411,.0033716,.0029193,.002387,.0017819,.0011093,37879e-8,-40024e-8,-.0012159,-.002056,-.0029064,-.0037527,-.0045791,-.0053699,-.0061082,-.006778,-.007363,-.0078475,-.0082153,-.0084535,-.0085479,-.0084873,-.0082614,-.007862,-.0072826,-.0065194,-.00557,-.0044354,-.0031181,-.0016241,39188e-9,.0018614,.00383,.0059296,.008144,.010454,.012839,.015277,.017745,.020218,.022673,.025085,.027427,.029676,.031808,.0338,.035631,.037279,.038728,.039961,.040964,.041727,.04224,.042498,.042498,.04224,.041727,.040964,.039961,.038728,.037279,.035631,.0338,.031808,.029676,.027427,.025085,.022673,.020218,.017745,.015277,.012839,.010454,.008144,.0059296,.00383,.0018614,39188e-9,-.0016241,-.0031181,-.0044354,-.00557,-.0065194,-.0072826,-.007862,-.0082614,-.0084873,-.0085479,-.0084535,-.0082153,-.0078475,-.007363,-.006778,-.0061082,-.0053699,-.0045791,-.0037527,-.0029064,-.002056,-.0012159,-40024e-8,37879e-8,.0011093,.0017819,.002387,.0029193,.0033716,.0037411,.0040256,.0042245,.0043381,.0043693,.0043211,.0041989,.0040081,.0037558,.003449,.0030964,.0027056,.0022869,.001847,.0013968,94413e-8,49677e-8,62545e-9,-3507e-7,-73703e-8,-.0010903,-.0014065,-.0016809,-.0019112,-.0020944,-.0022306,-.0023179,-.0023594,-.0023534,-.0023046,-.0022163,-.0020897,-.00193,-.001742,-.0015302,-.0012998,-.0010553,-80225e-8,-54502e-8,-28944e-8,-3878e-8,20073e-8,4284e-7,63679e-8,82476e-8,9944e-7,.0011363,.001253,.0013429,.0014071,.0014449,.0014572,.0014451,.0014097,.0013539,.0012785,.0011887,.0010826,96872e-8,85449e-8,71566e-8,589e-6,46081e-8,33872e-8,21895e-8,10817e-8,44005e-10,-86773e-9,-1673e-7,-23281e-8,-28568e-8,-32265e-8,-34657e-8,-355e-6,-.0057279],I=[14796e-9,54604e-8,10129e-8,-11334e-10,-13189e-8,-19395e-8,-13571e-8,21337e-9,18632e-8,25029e-8,15699e-8,-52509e-9,-2543e-7,-3138e-7,-1739e-7,97403e-9,33704e-8,38346e-8,18391e-8,-15855e-8,-43525e-8,-45776e-8,-18388e-8,23889e-8,55005e-8,53497e-8,17021e-8,-34174e-8,-68209e-8,-61268e-8,-13912e-8,46928e-8,83027e-8,68693e-8,86099e-9,-62455e-8,-99487e-8,-75513e-8,-67519e-10,81051e-8,.0011744,81167e-8,-10417e-8,-.0010287,-.001367,-85273e-8,25207e-8,.0012819,.0015701,87113e-8,-44169e-8,-.0015723,-.0017801,-86101e-8,6801e-7,.0019007,.0019933,81468e-8,-97311e-8,-.0022683,-.0022045,-7237e-7,.0013276,.0026763,.002408,57881e-8,-.0017511,-.0031255,-.0025968,-36912e-8,.0022518,.0036165,.0027634,82343e-9,-.0028398,-.0041506,-.0028982,29666e-8,.0035272,.0047294,.0029905,-78603e-8,-.0043296,-.0053562,-.0030274,.0014094,.0052683,.0060364,.0029929,-.0021982,-.0063734,-.0067797,-.0028658,.003197,.0076896,.0076028,.0026174,-.0044718,-.0092868,-.008534,-.0022054,.0061279,.01128,.0096244,.0015614,-.0083444,-.013874,-.010969,-56468e-8,.011455,.017461,.01276,-.0010262,-.016164,-.022908,-.015444,.0037854,.024249,.03255,.020318,-.0095077,-.041874,-.055528,-.033308,.02819,.11468,.19857,.25007,.25007,.19857,.11468,.02819,-.033308,-.055528,-.041874,-.0095077,.020318,.03255,.024249,.0037854,-.015444,-.022908,-.016164,-.0010262,.01276,.017461,.011455,-56468e-8,-.010969,-.013874,-.0083444,.0015614,.0096244,.01128,.0061279,-.0022054,-.008534,-.0092868,-.0044718,.0026174,.0076028,.0076896,.003197,-.0028658,-.0067797,-.0063734,-.0021982,.0029929,.0060364,.0052683,.0014094,-.0030274,-.0053562,-.0043296,-78603e-8,.0029905,.0047294,.0035272,29666e-8,-.0028982,-.0041506,-.0028398,82343e-9,.0027634,.0036165,.0022518,-36912e-8,-.0025968,-.0031255,-.0017511,57881e-8,.002408,.0026763,.0013276,-7237e-7,-.0022045,-.0022683,-97311e-8,81468e-8,.0019933,.0019007,6801e-7,-86101e-8,-.0017801,-.0015723,-44169e-8,87113e-8,.0015701,.0012819,25207e-8,-85273e-8,-.001367,-.0010287,-10417e-8,81167e-8,.0011744,81051e-8,-67519e-10,-75513e-8,-99487e-8,-62455e-8,86099e-9,68693e-8,83027e-8,46928e-8,-13912e-8,-61268e-8,-68209e-8,-34174e-8,17021e-8,53497e-8,55005e-8,23889e-8,-18388e-8,-45776e-8,-43525e-8,-15855e-8,18391e-8,38346e-8,33704e-8,97403e-9,-1739e-7,-3138e-7,-2543e-7,-52509e-9,15699e-8,25029e-8,18632e-8,21337e-9,-13571e-8,-19395e-8,-13189e-8,-11334e-10,10129e-8,54604e-8,14796e-9],E=[.0065862,-.0022838,-.0059202,-.0112239,-.0169697,-.0214685,-.022742,-.0189184,-.0086407,.0084932,.0316914,.0588926,.0870663,.1126093,.1320398,.1425063,.1425063,.1320398,.1126093,.0870663,.0588926,.0316914,.0084932,-.0086407,-.0189184,-.022742,-.0214685,-.0169697,-.0112239,-.0059202,-.0022838,.0065862],N=[-.0086492,-.0044524,-.0043664,-.0030946,-3094e-7,.0042348,.010627,.018809,.028525,.039333,.050605,.061655,.071697,.079997,.085925,.089013,.089013,.085925,.079997,.071697,.061655,.050605,.039333,.028525,.018809,.010627,.0042348,-3094e-7,-.0030946,-.0043664,-.0044524,-.0086492],P=[.0080236,.001488,-.0074204,-.0175495,-.0195816,-.0075536,.0136434,.0283156,.020311,-.0121801,-.0489419,-.0561146,-.0078976,.0922184,.2069483,.2833355,.2833355,.2069483,.0922184,-.0078976,-.0561146,-.0489419,-.0121801,.020311,.0283156,.0136434,-.0075536,-.0195816,-.0175495,-.0074204,.001488,.0080236],W=!0,F=1e3,H=!1,L=0,R=0,q=0,V=0,G=5,J=25,O=[],U=0,j=1,K=0,Q=0,X=0,Y=0,Z=0,$=0,ee=0;if(c=document.ct){var te=/firefox\/([0-9]+)/i.exec(navigator.userAgent);te&&41>te[1]&&(U=1),c.sampleRate=b;b=c.sampleRate;var ne,re,oe,ae,se,ie,ce,ue,le,de,fe,he,pe,me,ve,we,ge,be,ye,_e,Me,Ae,Be,Ce,De=2*(De=2048),ke=0,xe=0,Te=0,Se=0,ze=0,Ie=0,Ee=0,Ne=0,Pe=0,We=0,Fe=0,He=0,Le=0,Re=0,qe=0,Ve=0,Ge=0,Je=0,Oe=0,Ue=0,je=0,Ke=0,Qe=0,Xe=0,Ye=0,Ze=0,$e=0,et=0,tt=0,nt=0,rt=0,ot=0;b<=8e3?(ie=-1.76499291305108,ce=se=.88249645652554,ue=-1.7511415580071479,le=.7788442680950122,ve=.125,ne=5,fe=1.99999,he=de=.99999,pe=1.99999,me=.99999,ha0=.9726136465544695,we=-1.945227293108939,ge=ha0,be=-1.9444771540706607,ye=.9459774321472173,_e=1.5791932624702105,Me=-1.2953024643672797,Ae=.46288653436258276,Be=-.46293802529104094,Ce=.20971535775655464):b<=12e3?(ie=-1.8401109909638032,ce=se=.9200554954819016,ue=-1.8337114071978415,le=.8465105747297649,ve=.1,ne=5,fe=1.99999,he=de=.99999,pe=1.99999,me=.99999,ha0=.9816580973135585,we=-1.963316194627117,ge=ha0,be=-1.9629797472685724,ye=.9636526419856617,_e=1.7038521971885163,Me=-2.0754884062105936,Ae=.7621605007733473,Be=-.9428090415820632,Ce=.3333333333333333):b<=24e3?(ie=-1.918394719887696,ce=se=.959197359943848,ue=-1.9167296538189462,le=.9200597859564457,ve=.05,ne=5,fe=1.3785579524300922,he=de=.6892789762150461,pe=1.279581944567603,me=.477533960292581,ha0=.9907866108009425,we=-1.9976873144636018,ge=ha0,be=-1.9814883348730705,ye=.9816581083306998,_e=1.8413473117793424,Me=-2.961222758097686,Ae=1.2396937751507136,Be=-1.454243586251585,Ce=.5740619150839548):b<=48e3?(ie=-1.958772620051773,ce=se=.9793863100258865,ue=-1.9583477764103403,le=.9591974636932055,ve=.025,ne=5,fe=.4403624090500293,he=de=.22018120452501466,pe=-.3075475090293954,me=.18827232712945405,ha0=.9953826456126379,we=-1.9907652912252758,ge=ha0,be=-1.9907439715571362,ye=.9907866108934155,_e=1.9162179203105667,Me=-3.4561910251726538,Ae=1.5737438765784073,Be=-1.723776172762509,Ce=.7575469444788289):b<=96e3?(ie=-1.9792789580076073,ce=se=.9896394790038037,ue=-1.979171646815277,le=.9793862691999379,ve=.0125,ne=5,fe=.14445518519274364,he=de=.07222759259637182,pe=-1.1091783806868014,me=.39808875107228864,ha0=.9976886516146344,we=-1.9953773032292688,ge=ha0,be=-1.9953719609930045,ye=.9953826454655329,_e=1.9552513586371987,Me=-3.7183855815501183,Ae=1.7721405535403059,Be=-1.861361146829083,Ce=.8703674774564693):(ie=-1.989612497191258,ce=se=.994806248595629,ue=-1.9895855300600238,le=.9896394643224923,ve=.00625,ne=5,fe=.04324022727050973,he=de=.021620113635254866,pe=-1.5430779694435248,me=.6295584239845442,ha0=.9988436572318009,we=-1.9976873144636018,ge=ha0,be=-1.9976859773601736,ye=.99768865156703,_e=1.9751427000103667,Me=-3.853224886149808,Ae=1.8804104906763857,Be=-1.9306064272196681,Ce=.9329347317566122);var at,st,it,ct,ut,lt,dt,ft,ht,pt,mt,vt,wt=121,gt=120,bt=48,yt=.001,_t=.99999,Mt=300,At=bt,Bt=yt,Ct=_t,Dt=0,kt=Array(512).fill(0),xt=Array(wt).fill(0),Tt=Array(5e3).fill(0),St=150,zt=.05,It=.9997,Et=bt,Nt=yt,Pt=_t,Wt=0,Ft=0,Ht=Array(512).fill(0),Lt=Array(wt).fill(0),Rt=Array(5e3).fill(0);try{u=c.createScriptProcessor(De,0,1)}catch(e){u=c.createJavaScriptNode(De,1,1)}if(u.onaudioprocess=n,this.p=u,l=c.createConvolver(),u.connect(l),l.connect(c.destination),window.sup_android)T=c.createBuffer(1,32,b),T.getChannelData(0).set(E),O[0]=T,T=c.createBuffer(1,32,b),T.getChannelData(0).set(E),O[1]=T,T=c.createBuffer(1,32,b),T.getChannelData(0).set(N),O[2]=T,T=c.createBuffer(1,32,b),T.getChannelData(0).set(P),O[3]=T;else for(1>(E=Math.round(b/48e3))&&(E=1),N=512*E,z=[S,T,z,I],S=0;S<z.length;S++){P=z[S];var qt=[];for(T=0;T<P.length;T++)for(I=0;I<E;I++)qt[T*E+I]=P[T];T=c.createBuffer(1,N,b),T.getChannelData(0).set(qt),O[S]=T}l.normalize=!1,l.buffer=O[0],U&&(f=c.createScriptProcessor(De,1,1),u.connect(f),f.onaudioprocess=function(t){t=t.inputBuffer.getChannelData(0),H||(J?J--:0!=t[0]?G=5:--G||(G=5,J=25,U++,u.disconnect(),u.onaudioprocess=e,(u=c.createScriptProcessor(De,1,1)).onaudioprocess=n,this.p=u,u.connect(l),u.connect(f)))})}else(h=new Audio)&&h.mozSetup?h.mozSetup(1,b):(h=e,window.browsersupporterror&&window.browsersupporterror());var Vt,Gt=0,Jt=.3*b;doe=function(){if(h){var e=h.mozCurrentSampleOffset(),t=Math.round(Jt-(K-e));0==Gt&&(0==e?t=Math.round(.05*b):(Jt=(Gt=K)+Math.round(.05*b))<.25*b&&(Jt=Math.round(.25*b)));var n=[];for(e=0;e<t;e++){var o=p[v],a=y*g/b;if(1<=(w+=a)){w-=1,p[v]=0,++v>=r&&(v-=r);var s=p[v];W&&(o=(w*s+(a-w)*o)/a)}H&&(o=0),(o=2e-5*o*_)||(o=0),s=.044*(a=.044*o+.088*Q+.044*X- -1.354*Y-.53*Z)+.088*Y+.044*Z- -1.354*$-.53*ee,X=Q,Q=o,Z=Y,Y=a,ee=$,$=s,n[e]=s,3==Vt&&(n[e]=o)}L=(new Date).getTime(),t=h.mozWriteAudio(n),K+=t}};qt=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];var Ot,Ut,jt,Kt=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],Qt=0,Xt=new WebSocket("ws://"+window.location.host+"/~~stream?v=11");Xt.binaryType="arraybuffer";var Yt=500;Xt.onmessage=function(e){c||doe();var t=(2*r+m-v-((new Date).getTime()-L)*g/1e3)%r;(Yt+=.01*(t-Yt))>2*F&&(v=(r+m-F)%r,t=Yt=F),1.002<(y=1+1e-5*(Yt-F))&&(y=1.002),.998>y&&(y=.998),t=Math.round(t)+" "+Math.round(F)+" "+Math.round(Yt)+" "+Math.round(1e6*(y-1))+"<br>"+Math.round(g)+" "+Vt+" "+Math.round(b),t+=c?" WebAudio":h?" MozAudio":" none",t+="<br>",U&&(t+=" FFbug "+(U-1)+"("+G+","+J+")"),t+="<br>"+V+" "+c.state,document.getElementById("soundappletdebug").innerHTML=t;var n;t=new Uint8Array(e.data);for(e=m,lastlen=t.length,n=0;n<t.length;n++){var o=0,u=0;if(240==(240&t[n]))smeter=256*(15&t[n])+t[n+1],C.smetercallback&&C.smetercallback(10*smeter),n++;else if(128==t[n]){var d,f;for(d=0;128>d;d++)p[m+d]=x[t[n+1+d]];for((m+=128)>=r&&(m-=r),n+=128,f=0;20>f;f++)qt[f]=Kt[f]=0;Qt=0}else if(144<=t[n]&&223>=t[n])u=4,o=2,Ut=14-(t[n]>>4);else if(128!=(128&t[n]))u=1,o=2;else if(129==t[n])0<(g=256*t[n+1]+t[n+2])?M=1:(M=0,stopall()),n+=2;else if(130==t[n])Ot=256*t[n+1]+t[n+2],n+=2;else if(131==t[n])jt=t[n+1],(f=15&t[n+1])!=Vt&&(Vt=f,l&&(l.buffer=O[Vt])),n++;else if(132==t[n]){for(d=0;128>d;d++)p[m+d]=0;for((m+=128)>=r&&(m-=r),f=0;20>f;f++)qt[f]=Kt[f]=0;Qt=0}else if(133==t[n]){var w=16777216*(((15&t[n+1])<<16)+(t[n+2]<<8)+t[n+3])+(t[n+4]<<16)+(t[n+5]<<8)+t[n+6];d=t[n+1]>>4,C.truefreqcallback&&C.truefreqcallback(w,d),n+=6}if(2==o){for(o=0,f=16==(16&jt)?12:14;128>o;){var _;w=255&t[n+3]|(255&t[n+2])<<8|(255&t[n+1])<<16|(255&t[n+0])<<24,d=0,_=15-Ut;var T=Ot,S=[999,999,8,4,2,1,99,99];if(0!=(w<<=u))for(;0==(2147483648&w)&&d<_;)w<<=1,d++;d<_?(_=d,d++,w<<=1):(_=w>>24&255,d+=8,w<<=8);var z=0;for(_>=S[Ut]&&z++,_>=S[Ut-1]&&z++,z>Ut-1&&(z=Ut-1),S=(w>>16&65535)>>17-Ut&-1<<z,S+=_<<Ut-1,0!=(w&1<<32-Ut+z)&&(S=~(S|=(1<<z)-1)),u+=d+Ut-z;8<=u;)n++,u-=8;for(d=w=0;20>d;d++)w+=qt[d]*Kt[d];for(w=0<=(w|=0)?w>>12:w+4095>>12,S=(T=S*T+T/2)>>4,d=19;0<=d&&(qt[d]+=-(qt[d]>>7)+(Kt[d]*S>>f),0!=d);d--)Kt[d]=Kt[d-1];Kt[0]=w+T,d=Kt[0]+(Qt>>4),Qt=16==(16&jt)?0:Qt+(Kt[0]<<4>>3),p[m++]=d,m>=r&&(m-=r),o++}0==u&&n--}}if(a)for(;e!=m;){for(i+=s/g;1<=i;)a.setInt16(A,p[e],!0),65536<=(A+=2)&&(t=new ArrayBuffer(65536),A=0,a=new DataView(t),B.push(t)),i--;++e>=r&&(e-=r)}D&&(m<k?(D.postMessage(p.subarray(k),"*"),k=0):m>=k+1024&&(D.postMessage(p.subarray(k,k+1024),"*"),k+=1024)),j&&((e=document.getElementById("audiostartbutton"))&&(e.style.display="suspended"===c.state?"block":"none"),"running"===c.state&&(j=0))},Xt.onopen=function(){soundappletstarted()},Xt.onclose=function(){for(var t=0;t<r;t++)p[t]=0;Xt.onclose=e,Xt=Xt.onmessage=e},this.setparam=function(e){try{Xt.send("GET /~~param?"+e)}catch(e){}},this.smeter=function(){return 10*smeter},this.getid=function(){return M},this.mute=function(){H=!H},this.setvolume=function(e){_=e},this.setdelay1=function(e){Yt=F=e,v=(r+m-F)%r},this.modeinfo=function(e){Se=e},this.setparam2=function(e){Ge=e,Dt=0,At=48,Bt=.01,Ct=.99999},this.setnoise=function(e){1==(Ft=e)?(Wt=0,Et=2,Nt=.05,Pt=.99999,dt=1):2==Ft?(Wt=0,Et=4,Nt=.005,Pt=.999975,dt=1.5):3==Ft?(Wt=0,Et=8,Nt=.025,Pt=.999975,dt=1.5):4==Ft?(Wt=0,Et=32,Nt=.01,Pt=.9999,dt=2):(Et=0,Nt=0,Pt=0,dt=0)},stopall=function(){c?(Xt.close(),u.onaudioprocess=e,u.disconnect(),u.destination=e,U&&(f.onaudioprocess=e,f.disconnect(f),f.destination=e),O=this.p=c=d=l=u=e):(Xt.close(),h=e)},this.sethboost=function(e){Je=e},this.restartaudio=function(){stopall(),document.ct=new t,window.prep_html5sound()},this.destroy=function(){stopall(),window.soundapplet=e},this.rec_start=function(){A=0,s=g,i=0;var e=new ArrayBuffer(65536);a=new DataView(e),B=[e]},this.rec_finish=function(){B[B.length-1]=B[B.length-1].slice(0,A),a=e;var t={};return t.wavdata=B,t.len=65536*(B.length-1)+A,t.sr=s,t},this.rec_length_kB=function(){return(65536*(B.length-1)+A)/1024},this.setbcaudio=function(e){D=e,k=m},this.setstereo=function(e){0>e?(l.disconnect(),l.connect(c.destination)):(d||(d=c.createChannelMerger()).connect(c.destination),l.disconnect(),l.connect(d,0,e))},this.audioresume=function(){c.resume();var e=document.getElementById("audiostartbutton");e&&(e.style.display="none"),j=0}}window.prep_html5sound=function(){window.soundapplet=new a},prep_html5sound()}();
