import React from "react";
import { io } from "socket.io-client";
import './board.css';
import {FaEraser, FaUndo } from 'react-icons/fa';

class board extends React.Component {
    timeout;
    socket= io("http://localhost:5000");
    ctx;

    constructor(props){
        super(props);
        this.socket.on("canvas-data",function(data){
            var image = new Image();
            var canvas = document.querySelector('#board');
            var ctx=canvas.getContext('2d');
            image.onload=function(){
                ctx.drawImage(image,0,0);
            };
            image.src=data;
        })
    }
    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
    }
    componentDidMount(){
        this.paint();
    }
    paint(){
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
        this.ctx=ctx;
        var sketch_style = getComputedStyle(canvas);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
    
        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};
    
        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;
    
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
    
    
        /* Drawing on Paint App */
        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;
        window.addEventListener('resize', function(){
            var temp_base64ImageData=canvas.toDataURL("image/png");
            canvas.width = parseInt(sketch_style.getPropertyValue('width'));
            canvas.height = parseInt(sketch_style.getPropertyValue('height'));
            var image = new Image();
            image.onload=function(){
                ctx.drawImage(image,0,0,canvas.width,canvas.height);
            };
            image.src=temp_base64ImageData;
            ctx.lineWidth = root.props.size;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = root.props.color;
        });
        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);
    
        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var root=this;
        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
            if(root.timeout !== undefined){clearTimeout(root.timeout);}
            root.timeout=setTimeout(function(){
                var base64ImageData=canvas.toDataURL("image/png");
                root.socket.emit("canvas-data",base64ImageData);
            },50)

        };
    
    };
    render(){
        return(
            <div>
                <canvas className="board" id ="board"></canvas>
            </div>
        )
    }
 }

export default board