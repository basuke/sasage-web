export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

export const scrollTo = (selector: string) => {
    const elem = document.querySelector(selector);
    if (elem) {
        elem.scrollIntoView({
            behavior: 'smooth',
        });
    }
};
