let g_mouseDown = false

let single_step_array = []
let current_steps_array = []
let current_steps = 0
let total_steps_array = []
let total_steps = 0
let new_not_save = true;

let mLang = {
  tip:{
    exit:'do you want?'
  }
}
function isObj(_obj){
  if(Object.keys(_obj).length === 0 && _obj.constructor === Object){
    return true;
  }else{
    return false;
  }
}
function getLang(_code, _langObj){
  if(_code.length<=0 || !isObj(_langObj)){
    return "";
  }
  let code = _code.split('.');
  let langObj = _langObj;
  for(let i=0;i<code.length;i++){
    
  }
  return _langObj[_code]
}

function initDrawData(){
  single_step_array = []
  current_steps_array = []
  current_steps = 0
  total_steps_array = []
  total_steps = 0
}
function paperInit(){
  const js_canvas = document.getElementById('canvas');
  const cpRect = js_canvas.parentNode.getBoundingClientRect()
  js_canvas.setAttribute('width', cpRect.width)
  js_canvas.setAttribute('height', cpRect.height)
  
  
  detectCtx('canvas').then((ctx)=>{
    ctx.fillStyle = '#fff'
    ctx.fillRect (0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    if(total_steps_array.length>0){
      printPath(total_steps_array)
    }
  })
  
}
function showCoordinate(_x, _y){
  const js_coordinate = document.getElementById('coordinate')
  js_coordinate.innerHTML = 'x:'+_x+', y:'+_y
}

function isHasClass(_target, _class){
  if(!_target.className || !_class){
    return false;
  }
  // let tmp_classnames = _target.className.split(' ');
  // console.log(tmp_classnames)
  return _target.className.includes(_class)
}
function replaceClassName(_target, _class, _newclass){
  let tmp_classnames = _target.className.split(' ');
  // let flag = false
  tmp_classnames.forEach((value, key)=>{
    if(value == _class){
      tmp_classnames[key] = _newclass
      // flag = true
      return
    }
  })
  // if(flag){
    tmp_classnames=tmp_classnames.join(' ')
  // }
  // console.log(tmp_classnames)
  return tmp_classnames
}

function pencilBtn(e){
  const js_pencil = document.getElementById('pencil')
  const js_canvas = document.getElementById('canvas')
  js_pencil.className = replaceClassName(js_pencil, 'is-default', 'is-outlined')
  
  // js_canvas.style.cursor = 'url(./../assets/pencil.ico)'
  // js_canvas.style.cursor = "defualt"
  console.log(js_canvas.style)
  bindPencilEvent(js_canvas)
}

function bindPencilEvent(_target){
  _target.addEventListener('touchstart', PencilDown)
  _target.addEventListener('mousedown', PencilDown)
  _target.addEventListener('mousemove', PencilMove)
  _target.addEventListener('touchmove', PencilMove)
  
  _target.addEventListener('mouseup', PencilUp)
  _target.addEventListener('touchend', PencilUp)
  _target.addEventListener('mousecancel', PencilUp)
  _target.addEventListener('touchcancel', PencilUp)
  _target.addEventListener('mouseleave', PencilUp) //离开画布后取消笔触
}
function unBindPencilEvent(_target){
  _target.removeEventListener('touchstart', PencilDown)
  _target.removeEventListener('mousedown', PencilDown)
  _target.removeEventListener('mousemove', PencilMove)
  _target.removeEventListener('touchmove', PencilMove)
  
  _target.removeEventListener('mouseup', PencilUp)
  _target.removeEventListener('touchend', PencilUp)
  _target.removeEventListener('mousecancel', PencilUp)
  _target.removeEventListener('touchcancel', PencilUp)
  _target.removeEventListener('mouseleave', PencilUp) //离开画布后取消笔触
}
function PencilDown(e){
  // const canvas_x = e.pageX
  // const canvas_y = e.pageY
  // e.preventDefault()
  // e.stopPropagation()
  
  const js_canvas = document.getElementById('canvas')
  // js_canvas.focus()
  const js_canvas_rect = js_canvas.getBoundingClientRect()
  let canvas_x = e.clientX||e.changedTouches[0].clientX
  let canvas_y = e.clientY||e.changedTouches[0].clientY
  // showCoordinate(canvas_x, canvas_y)
  canvas_x = canvas_x-js_canvas_rect.left;
  canvas_y = canvas_y-js_canvas_rect.top;
  single_step_array = []
  single_step_array.push({x:canvas_x, y:canvas_y})
  g_mouseDown = true
  lineBrush(canvas_x, canvas_y, 'start')
}
function PencilMove(e){
  // e.preventDefault()
  // e.stopPropagation()
  if(g_mouseDown){
    // const rect = canvas.getBoundingClientRect();
    const js_canvas = document.getElementById('canvas').getBoundingClientRect()
    let canvas_x = e.clientX||e.changedTouches[0].clientX
    let canvas_y = e.clientY||e.changedTouches[0].clientY

    canvas_x = canvas_x-js_canvas.left;
    canvas_y = canvas_y-js_canvas.top;
    single_step_array.push({x:canvas_x, y:canvas_y})
    // showCoordinate(canvas_x, canvas_y)
    lineBrush(canvas_x, canvas_y, 'move')
  }
}
function PencilUp(e){
  // e.preventDefault()
  // e.stopPropagation()
  if(g_mouseDown){
    
    g_mouseDown = false;
    const js_canvas = document.getElementById('canvas').getBoundingClientRect()
    // console.dir(rect)
    let canvas_x = e.clientX||e.changedTouches[0].clientX;
    let canvas_y = e.clientY||e.changedTouches[0].clientY;
    // showCoordinate(canvas_x, canvas_y)
    canvas_x = canvas_x-js_canvas.left;
    canvas_y = canvas_y-js_canvas.top;

    single_step_array.push({x:canvas_x, y:canvas_y});
    current_steps_array=[...current_steps_array,single_step_array];
    total_steps_array = JSON.parse(JSON.stringify(current_steps_array));
    current_steps = current_steps+1;
    total_steps = total_steps_array.length;
    // current_steps_array = JSON.parse(JSON.stringify(total_steps_array))
    lineBrush(canvas_x, canvas_y, 'end')
    
  }
}
function lineBrush(_x, _y, _type){
  detectCtx('canvas').then((ctx)=>{
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'black'
    if(_type == 'start'){
      ctx.beginPath();
      ctx.moveTo(_x,_y);
      ctx.lineTo(_x+1,_y+1);
      // ctx.stroke()
    }else if(_type == 'move'){
      ctx.lineTo(_x,_y);
      // ctx.stroke()
    }else{
      ctx.lineTo(_x,_y);
      // ctx.closePath();
      // ctx.stroke();
      
    }
    ctx.stroke()
  })
  
}

function getImage(){
  detectCtx('canvas').then((ctx)=>{
    
    const js_saveName = document.getElementById('saveName');
    const js_fileType = document.getElementById('fileType')
    const myImageData = ctx.canvas.toDataURL('image/'+js_fileType.value, 1.0)
    // console.log(js_fileType.value)
    // return
    const img = new Image()
    img.src = myImageData
    const downloadTag = document.createElement('a');
    downloadTag.href = myImageData
    
    const tmp_downName = js_saveName.value.trim()
    downloadTag.download = tmp_downName === ''?'download.png':tmp_downName
    // console.log(downloadTag.download)
    // return
    downloadTag.click()
    new_not_save = false;
    // document.getElementById('controlPanel').appendChild(img)

    // ctx.canvas.toBlob(function(blob){
    // 	const img = new Image()
    // 	url = URL.createObjectURL(blob);
    // 	img.onload = function() {
    // 		// no longer need to read the blob so it's revoked
    // 		URL.revokeObjectURL(url);
    // 	};
    // 	img.src = url
    // 	document.getElementById('controlPanel').appendChild(img)
    // }, 'image/png', 1.0);
  })
}

function printPath(_pdata){
  detectCtx('canvas').then((ctx)=>{
    
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
    if(_pdata.length>0){
      
      _pdata.forEach((value, key)=>{
        ctx.beginPath();
        ctx.moveTo(value[0].x, value[0].y);
        
        for(let i=1;i<value.length;i++){
          ctx.lineTo(value[i].x,value[i].y);
          
        }
        // ctx.lineTo(value[value.length-1][0],value[value.length-1][1]);
        ctx.stroke()
        
      })
      
    }
  })
}
function repealAction(e){
  new_not_save = true;
  let tmp_array = JSON.parse(JSON.stringify(total_steps_array))
  
  current_steps=current_steps-1
  current_steps=current_steps<=0?0:current_steps
  
  tmp_array = current_steps>0?tmp_array.slice(0,current_steps):[]
  tmp_array.slice(0,current_steps)
  current_steps_array = tmp_array
  printPath(tmp_array)
}
function nextAction(e){
  new_not_save = true;
  let tmp_array = JSON.parse(JSON.stringify(total_steps_array));
  current_steps=current_steps+1;
  current_steps=current_steps>total_steps?total_steps:current_steps;
  if(current_steps<=total_steps){
    tmp_array = current_steps>0?tmp_array.slice(0,current_steps):[];
    current_steps_array = tmp_array
    printPath(tmp_array)
  }
}
function clearAllAction(e){
  new_not_save = true;
  detectCtx('canvas').then((ctx)=>{
    ctx.beginPath();
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
    initDrawData()
  })
}

function detectCtx(_id){
  return new Promise((resolve, reject)=>{
    const js_canvas = document.getElementById(_id)
    if(js_canvas.getContext){
      const ctx = js_canvas.getContext('2d')
      resolve(ctx)
    }else{
      console.log('without context')
      reject({msg:'without context'})
    }
  })
}

function KeyPress(e){
  // Ensure event is not null
  e = e || window.event;
  
  // console.log(navigator.platform)
  console.log(e.keyCode)
  if (e.keyCode == 89 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.stopPropagation()
    e.preventDefault()
    nextAction()
    console.log('cmd+y')
  }else if (e.keyCode == 90 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.stopPropagation()
    e.preventDefault()
    repealAction()
    console.log('cmd+z')
  }else if (e.keyCode == 78 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.stopPropagation()
    e.preventDefault()
    console.log('cmd+n')
  }else if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.stopPropagation()
    e.preventDefault()
    console.log('cmd+s')
  }
}

window.addEventListener('load', ()=>{
  paperInit()
  pencilBtn()
  console.log(navigator.language)
  //zh-CN, en-US
})
window.addEventListener('resize', paperInit)
document.body.addEventListener('keydown', KeyPress)

window.onbeforeunload = function(evt) {
  var message = 'Did you want exit without save?';
  if (typeof evt == 'undefined') {
    evt = window.event;
  }
  if (evt && new_not_save && total_steps_array.length>0) {
    evt.returnValue = message;
    return message;
  }
}


