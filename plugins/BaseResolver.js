class BaseUrlResolver {
    constructor() {
        this.domains = [];
    }
    /**
     * 
     * @param {string} urlToResolve 
     */
    async resolve(urlToResolve) {
        var canResolve = this.domains.some((innerUrl) => {
            return (urlToResolve.startsWith(innerUrl));
        });
        if (canResolve) {
            try {
                return await this.resolveInner(urlToResolve);
            } catch (error) {
                console.log(error);
            }
        }
        return false;
    }

    async resolveInner(_urlToResolve) {
        throw ('Unimplemented');
    }

    createResult(title, link, poster, isPlayable) {
        return {
            title,
            link,
            poster,
            isPlayable
        };
    }
}

module.exports = BaseUrlResolver;
