{
    let view = {
        el: '.page > main',
        template: `
            <h1>新建歌曲</h1>
            <form class="form" action="">
                <div class="row">
                    <label for="">歌名</label>
                    <input name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label for="">歌手</label>
                    <input name="singer" type="text" name="" id="" value="__singer__">
                </div>
                <div class="row">
                    <label for="">外链 </label>
                    <input type="text" name="url" id="" value="__url__">
                </div>
                <div class="row">
                    <button   type="submit">保存</button>
                </div>

            </form>
        `
        ,
        init() {
            this.$el = $(this.el)
        },
        render(data = {}) {


            let placeholders = ['name', 'singer','url']
            let html = this.template

            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')

            })



            $(this.el).html(html)


        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        },
        creatData(data) {
            // 声明 class
            var Song = AV.Object.extend('Song');

            // 构建对象
            var song = new Song();

            // 为属性赋值
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            
            // 将对象保存到云端
            return song.save().then((newSong) => {
                
                let { id, attributes } = newSong
         
                
                Object.assign(this.data, { id, ...attributes })
             
                
            }, (error) => {
                console.error(error)
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload', (data) => {
                this.view.render(data)


            })

        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (event) => {
                event.preventDefault()
                let needs = ['name', 'singer', 'url']
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`input[name=${string}]`)[0].value
                })
             
                this.model.creatData(data)
                .then(this.view.reset()).then(()=>{
                    let copystring = JSON.stringify(this.model.data)
                    let object = JSON.parse(copystring)
                    window.eventHub.emit('creatSong', object)
                })
          
               
model
            })
        }
    }
    controller.init(view, model)
}