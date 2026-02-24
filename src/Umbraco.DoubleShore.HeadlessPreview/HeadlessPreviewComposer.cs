using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Routing;

namespace Umbraco.DoubleShore.HeadlessPreview
{
    /// <summary>
    /// Composer for registering headless preview services.
    /// This automatically registers the HeadlessPreviewUrlProvider
    /// as the primary preview option in Umbraco.
    /// </summary>
    /// <remarks>
    /// Part of the Umbraco.DoubleShore.HeadlessPreview package.
    /// For documentation and support, visit https://double-shore.com
    /// </remarks>
    public class HeadlessPreviewComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            // Register settings from appsettings.json "HeadlessPreview" section
            builder.Services.Configure<HeadlessPreviewSettings>(
                builder.Config.GetSection("HeadlessPreview"));

            // Register the headless preview URL provider
            // Insert() adds it as the FIRST option - ideal for headless CMS setups
            builder.UrlProviders().Insert<HeadlessPreviewUrlProvider>();
        }
    }
}
