skrollr.init({forceHeight:!1,smoothScrolling:!1}),realshadow(document.getElementsByTagName("h1"),{type:"text",color:"100,100,100"}),realshadow(document.getElementsByClassName("item-css"),{type:"drop",length:4}),realshadow(document.getElementsByClassName("item-html"),{type:"drop",length:3}),realshadow(document.getElementsByClassName("item-js"),{type:"drop",length:4}),realshadow(document.getElementsByClassName("item-drupal"),{type:"drop",length:6}),realshadow(document.getElementsByClassName("logo"),{type:"drop",length:3}),realshadow(document.getElementsByClassName("credit-box"),{type:"drop",length:3});var $blur_layer,$image_layer,blur_fade,blur_throttle,center_x,center_y,fade_length,max_blur,max_x,max_y,max_z,min_opacity,mouse_move_handler,perspective,transform,win_h,win_w;transform=function(e,t){return e.style.webkitTransform=t,e.style.transform=t},blur_fade=function(e,t,r){return e.setAttribute("style","-webkit-filter: blur("+t+"); filter: blur("+t+"); opacity: "+r+";")},win_w=window.innerWidth,win_h=window.innerHeight,center_x=win_w/2,center_y=win_h/2,max_x=.04*win_w,max_y=.04*win_h,max_z=30,perspective=1200,max_blur=300,min_opacity=.75,blur_throttle=8,fade_length=1-min_opacity,$image_layer=document.getElementById("background-image-layer"),$blur_layer=document.getElementById("scene-blur-layer"),mouse_move_handler=function(e,t,r,n){var a,l,m;return m="perspective("+perspective+") translate3d("+max_x*r+"px, "+max_y*n+"px, "+max_x*r+"px)",transform($image_layer,m),a=Math.abs(e-center_x)/center_x*blur_throttle+"px",l=1-fade_length*(Math.abs(e-center_x)/center_x),blur_fade($blur_layer,a,l)},document.addEventListener("mousemove",function(e){var t,r,n,a;window.event&&(e=window.event),t=e.clientX,r=e.clientY,n=1-t/center_x,a=1-r/center_y,mouse_move_handler(t,r,n,a)},!1);