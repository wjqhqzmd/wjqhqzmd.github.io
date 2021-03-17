
"use strict";
{
	const canvas = document.querySelector("canvas");
	let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, document.getElementById("vertexShader").text);
	gl.compileShader(vertexShader);
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, document.getElementById("fragmentShader").text);
	gl.compileShader(fragmentShader);
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);
	const uResolution = gl.getUniformLocation(program, "uResolution");
	const ue = gl.getUniformLocation(program, "ue");
	const ucs = gl.getUniformLocation(program, "ucs");
	const aPosition = gl.getAttribLocation(program, "aPosition");
	const buffer = gl.createBuffer();
	const resize = () => {
		const WIDTH = (canvas.width = canvas.offsetWidth);
		const HEIGHT = (canvas.height = canvas.offsetHeight);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(aPosition);
		gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				0,
				0,
				WIDTH,
				0,
				0,
				HEIGHT,
				0,
				HEIGHT,
				WIDTH,
				0,
				WIDTH,
				HEIGHT
			]),
			gl.STATIC_DRAW
		);
		gl.uniform2f(uResolution, WIDTH, HEIGHT);
		gl.viewport(0, 0, WIDTH, HEIGHT);
	};
	window.addEventListener("resize", _ => resize(), false);
	resize();
	////////////////////////////////////////////////////////
	let time = 8;
	const update = () => {
		requestAnimationFrame(update);
		time += 0.01;
		gl.uniform2f(ucs, Math.cos(time * 0.4), Math.sin(time * 0.4));
		gl.uniform3f(
			ue,
			0.5 + Math.sin(time * 0.5) * 0.1,
			0.5 + Math.cos(time * 0.47) * 0.1,
			-time * 0.3 + Math.sin(time * 0.3 - 0.01)
		);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	};
	update();
}