class BaseUrlResolver {
    constructor() {
        this.domains = [];
    }

    /**
     * @param {string} urlToResolve
     * Override this method if you want to implement can resolve function
     */
    async canResolve(urlToResolve) {
        return this.domains.some((innerUrl) => {
            return (urlToResolve.startsWith(innerUrl));
        });
    }

    /**
     * 
     * @param {string} urlToResolve 
     */
    async resolve(urlToResolve) {
        try {
            var canResolve = await this.canResolve(urlToResolve);
        } catch (error) {
            console.log('Error occurred while calling canresole BaseResolver');
            return false;
        }
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

    createResult(title, link, poster, isPlayable, referer) {
        return {
            title,
            link,
            poster,
            isPlayable,
            referer
        };
    }
}

module.exports = BaseUrlResolver;
