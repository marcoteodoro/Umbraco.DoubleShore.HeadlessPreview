using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Web;
using Microsoft.Extensions.Logging;

namespace Umbraco.DoubleShore.HeadlessPreview
{
    /// <summary>
    /// Custom URL provider that adds a preview URL pointing to your headless frontend.
    /// When an editor clicks "Preview" in the Umbraco backoffice, this provider
    /// generates a URL that enables draft mode and redirects to the content.
    /// </summary>
    /// <remarks>
    /// Part of the Umbraco.DoubleShore.HeadlessPreview package.
    /// For documentation and support, visit https://double-shore.com
    /// </remarks>
    public class HeadlessPreviewUrlProvider : IUrlProvider
    {
        private readonly HeadlessPreviewSettings _settings;
        private readonly IUmbracoContextAccessor _umbracoContextAccessor;
        private readonly IPublishedUrlProvider _publishedUrlProvider;
        private readonly ILogger<HeadlessPreviewUrlProvider> _logger;

        public HeadlessPreviewUrlProvider(
            IOptions<HeadlessPreviewSettings> settings,
            IUmbracoContextAccessor umbracoContextAccessor,
            IPublishedUrlProvider publishedUrlProvider,
            ILogger<HeadlessPreviewUrlProvider> logger)
        {
            _settings = settings.Value;
            _umbracoContextAccessor = umbracoContextAccessor;
            _publishedUrlProvider = publishedUrlProvider;
            _logger = logger;
        }

        /// <summary>
        /// Unique alias for this URL provider - must match the urlProviderAlias in umbraco-package.json.
        /// </summary>
        public string Alias => "HeadlessPreview";

        /// <summary>
        /// Not used for regular URL generation - we only provide preview URLs.
        /// </summary>
        public UrlInfo? GetUrl(IPublishedContent content, UrlMode mode, string? culture, Uri current)
            => null;

        /// <summary>
        /// Not used - we don't provide alternative URLs for content.
        /// </summary>
        public IEnumerable<UrlInfo> GetOtherUrls(int id, Uri current)
            => [];

        /// <summary>
        /// Generates a preview URL that redirects to your frontend with draft mode enabled.
        /// </summary>
        public Task<UrlInfo?> GetPreviewUrlAsync(IContent content, string? culture, string? segment)
        {
            if (!IsConfigured())
            {
                return Task.FromResult<UrlInfo?>(null);
            }

            try
            {
                var contentPath = GetContentPath(content, culture);
                
                if (string.IsNullOrEmpty(contentPath))
                {
                    _logger.LogDebug("Could not determine content path for preview: {Name} ({Culture})", 
                        content.Name, culture);
                    return Task.FromResult<UrlInfo?>(null);
                }

                var previewUrl = BuildPreviewUrl(contentPath, content.Key, culture);

                _logger.LogDebug("Generated headless preview URL for {Name}: {Url}", content.Name, previewUrl);

                return Task.FromResult<UrlInfo?>(new UrlInfo(
                    url: new Uri(previewUrl),
                    provider: Alias,
                    culture: culture,
                    message: _settings.PreviewLabel,
                    isExternal: true));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating preview URL for {Name}", content.Name);
                return Task.FromResult<UrlInfo?>(null);
            }
        }

        private string? GetContentPath(IContent content, string? culture)
        {
            if (!_umbracoContextAccessor.TryGetUmbracoContext(out var umbracoContext))
            {
                return GetFallbackPath(content, culture);
            }

            var publishedContent = umbracoContext.Content?.GetById(content.Key);
            
            if (publishedContent != null)
            {
                var url = _publishedUrlProvider.GetUrl(publishedContent, UrlMode.Relative, culture);
                if (!string.IsNullOrEmpty(url) && url != "#")
                {
                    return url;
                }
            }

            return GetFallbackPath(content, culture);
        }

        private string GetFallbackPath(IContent content, string? culture)
        {
            var segment = content.GetCultureName(culture ?? "en") ?? content.Name;
            var urlSegment = segment?.ToLowerInvariant().Replace(" ", "-") ?? "content";
            var culturePrefix = !string.IsNullOrEmpty(culture) 
                ? $"/{culture.Split('-')[0].ToLowerInvariant()}" 
                : "";
            
            return $"{culturePrefix}/{urlSegment}";
        }

        private string BuildPreviewUrl(string path, Guid contentKey, string? culture)
        {
            var baseUrl = _settings.BaseUrl.TrimEnd('/');
            var endpoint = _settings.PreviewEndpoint.TrimStart('/');
            var secret = Uri.EscapeDataString(_settings.PreviewSecret);
            var encodedPath = Uri.EscapeDataString(path);
            
            return $"{baseUrl}/{endpoint}?secret={secret}&path={encodedPath}&id={contentKey}";
        }

        private bool IsConfigured()
        {
            return _settings.Enabled && 
                   !string.IsNullOrEmpty(_settings.BaseUrl) && 
                   !string.IsNullOrEmpty(_settings.PreviewSecret);
        }
    }
}

