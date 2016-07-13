export default function navbar ($cookies) {
    return {
        restrict: 'E',
        controller: 'header',
        scope: {
            data: '='
        },
        template: '<canvas id="cert_canvas"></canvas>'
    }
}
