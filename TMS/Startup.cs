using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CHUNOApp.Startup))]
namespace CHUNOApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
