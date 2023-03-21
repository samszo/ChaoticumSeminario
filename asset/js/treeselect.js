import { Treeselect } from './treeselectjs.mjs.js'

const slot = document.createElement('div');
slot.innerHTML = '<a class="treeselect-demo__slot" href="">Click!</a>';
const domElement = document.querySelector('.treeselect-demo');
slot.addEventListener('click', (e) => {
  e.preventDefault()
  alert('Slot click!')
})

//ajoute les sources                
let sources = [];
d3.json("asset/js/sourcesGenStroy2023.js")
    .then(data => {
        data.forEach((s,i) => {
          let source = {name: s.label,value:'s_'+i,children: []};
          //récupère les données de la sources
          d3.json(s.url).then(dataSources => {
            dataSources.forEach(ds=>{
              source.children.push({name: ds['o:title'],value:'s_'+i+'c'+ds['o:id'],children: []}); 
            })
            sources.push(source);
            if(data.length==i+1){
              const treeselect = new Treeselect({
                parentHtmlContainer: domElement,
                value: [],
                options: sources,
                listSlotHtmlComponent: slot
              })
              treeselect.srcElement.addEventListener('input', (e) => {
                console.log('Selected value:', e.detail)
                srcSelect=e.detail;
              })          
            }  
          });
        });
    });

/*
const options = [
  {
    name: 'England',
    value: 'England',
    children: [
      {
        name: 'London',
        value: 'London',
        children: [
          {
            name: 'Chelsea',
            value: 'Chelsea',
            children: []
          },
          {
            name: 'West End',
            value: 'West End',
            children: []
          }
        ]
      },
      {
        name: 'Brighton',
        value: 'Brighton',
        children: []
      }
    ]
  },
  {
    name: 'France',
    value: 'France',
    children: [
      {
        name: 'Paris',
        value: 'Paris',
        children: []
      },
      {
        name: 'Lyon',
        value: 'Lyon',
        children: []
      }
    ]
  }
]
*/
/*
const treeselect = new Treeselect({
  parentHtmlContainer: domElement,
  value: ['West End', 'Paris', 'Lyon'],
  options: options,
  listSlotHtmlComponent: slot
})
treeselect.srcElement.addEventListener('input', (e) => {
  console.log('Selected value:', e.detail)
})
*/

