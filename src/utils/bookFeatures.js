


export class BookFeatures {

    constructor(query, queryData) {
        this.query = query
        this.queryData = queryData
    }

    pagination() {
        let {page} = this.queryData
        if(!page || page < 1) {
            page = 1
        }

        const skip = (page - 1) * +process.env.PAGINATION_SIZE
        this.query = this.query.skip(skip).limit(+process.env.PAGINATION_SIZE)
        return this
    }

    sort() {
        this.query = this.query.sort(this.queryData.sort)
        return this
    }

    filter() {
        let filterQueryData = this.queryData

        delete filterQueryData.page
        delete filterQueryData.sort
        delete filterQueryData.select

        filterQueryData = JSON.parse(
            JSON.stringify(filterQueryData).replace(/gt|gte|lt|lte|in|nin|eq|ne|regex/g, match => {
                return `$${match}`
            })
        )

        this.query.find(filterQueryData)
        return this
    }

    select () {
        this.query = this.query.select(this.queryData.select)
        return this
    }

}