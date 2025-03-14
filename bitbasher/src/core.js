function tick() {
	requestAnimationFrame(tick);
    tick_input();
    if (!timeFreeze)
        tick_entities();
    render();
}
level_load(0);
tick();
