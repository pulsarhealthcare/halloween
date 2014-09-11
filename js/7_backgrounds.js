
var GameOverBackground = me.ObjectEntity.extend({
    init: function(x, y, image, z) {
        var settings = {};
        settings.image = me.loader.getImage(image);
        settings.width = 1024;
        settings.height = window.innerHeight;
        settings.spritewidth = 1024;
        settings.spriteheight = window.innerHeight;


        this.parent(x, y, settings);
    },


    update: function() {
        if (game.data.mDown) {

        }
        return true;
    },
});




