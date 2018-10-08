export const SideBar = (props) => {
  return (<aside class="sidebar">
  <div class="scrollbar-inner">      
      <ul class="navigation">
          <li><a attrs-route="app"><i class="zmdi zmdi-home"></i> Início</a></li>          

          <li><a attrs-route="assistance"><i class="zmdi zmdi-format-underlined"></i> Assistência</a></li>

          <li><a attrs-route="consultations"><i class="zmdi zmdi-widgets"></i> Interconsultas</a></li>

          <li><a attrs-route="configuration"><i class="zmdi zmdi-widgets"></i> Configurações</a></li>                              
      </ul>
  </div>
</aside>)
}