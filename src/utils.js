export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

export const scrollTo = selector => {
    const elem = document.querySelector(selector);
    if (elem) {
        elem.scrollIntoView({
            behavior: 'smooth'
        });
    }
};


export const afterTick = (task) => {
    setTimeout(task, 16);
}
