export const create = async ({
    model,
    data = [{}],
    options = { validateBeforeSave: true }   //apply schema validations
} = {}) => {
    return await model.create(data, options)
}

export const find = async ({
    model,
    filter = {},
    select = "",
    populate = [],
    skip = 0,
    limit = 10,
    sort = {}
} = {}) => {
    return await model.find(filter)
        .select(select)
        .populate(populate)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .lean()
}

export const findOne = async ({
    model,
    filter = {},
    select = "",
    populate = []
} = {}) => {
    return await model.findOne(filter)
        .select(select)
        .populate(populate)
}

export const findById = async ({
    model,
    id,
    select = "",
    populate = []
} = {}) => {
    return await model.findById(id)
        .select(select)
        .populate(populate)
}

export const updateOne = async ({
    model,
    filter = {},
    data = {},
    options = { runValidators: true }
} = {}) => {
    return await model.updateOne(filter, data, options)

}

export const findByIdAndUpdate = async ({
    model,
    id,
    data = {},
    options = { new: true, runValidators: true }
} = {}) => {
    return await model.findByIdAndUpdate(id, data, options)
}

export const deleteOne = async ({
    model,
    filter = {}
} = {}) => {
    return await model.deleteOne(filter)
}

export const exists = async ({
    model,
    filter = {}
} = {}) => {
    return await model.exists(filter)
}
