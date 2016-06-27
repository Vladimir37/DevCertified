import underscore from 'underscore';

export function validate(obj) {
    return _.values(obj).every(function (value) {
        return value;
    });
}
