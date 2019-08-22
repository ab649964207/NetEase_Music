{
    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList">
        </ul>   
        `
        ,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            let{songs} = data
            
            
            let liList = songs.map((song)=>{
                

                
                return ($('<li></li>').text(song.name).attr('data-song-id', song.id))
                
             
                
                 
            })
            $el.find('ul').empty()
            
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
          
            
        },
        getActiveItem(li){
            li.addClass('active').siblings('.active').removeClass('active')
           
           
            
        },
        clearAllAcitve(){
            $(this.el).children().children('.active').removeClass('active')
           
            
             
        }
    }
    let model = {
        data:{
            songs:[]
        },
        find(){
           
            let query = new AV.Query('Song');
         
            
            return query.find().then((songs)=>{ 
                this.data.songs = songs.map((song)=>{
                    return {id: song.id, ...song.attributes}
                })
        
            
               
                
                
            },(error)=>{
                console.log(error);
            })
            
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.getAllSongs()
            this.bindEvents()
            this.bindEventHub()

           
            
        },
        getAllSongs(){
            this.model.find()
                .then(() => {
                    
                    
                    this.view.render(this.model.data)
                })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                li = $(e.currentTarget)
               this.view.getActiveItem(li)
               console.log(li);
               
                let songId = e.currentTarget.getAttribute('data-song-id')
               window.eventHub.emit('select-song',songId)
            })
        },
        bindEventHub(){
            window.eventHub.on('creatSong', (newsong) => {
                this.model.data.songs.push(newsong)
                this.view.render(this.model.data)
            })
            window.eventHub.on('upload',()=>{
                this.view.clearAllAcitve()
            })
        }
        
    }
    controller.init(view, model)

}