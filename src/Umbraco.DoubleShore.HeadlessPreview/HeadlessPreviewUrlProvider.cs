using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Microsoft.Extensions.Logging;

namespace Umbraco.DoubleShore.HeadlessPreview
{
    /// <summary>
    /// Custom URL provider that adds a preview URL pointing to your headless frontend.
    /// </summary>
    public class HeadlessPreviewUrlProvider : IUrlProvider
    {
        private readonly HeadlessPreviewSettings _settings;
        private readonly IUmbracoContextAccessor _umbracoContextAccessor;
        private readonly IPublishedUrlProvider _publishedUrlProvider;
        private readonly IDictionaryItemService _dictionaryItemService;
        private readonly ILogger<HeadlessPreviewUrlProvider> _logger;

        public HeadlessPreviewUrlProvider(
            IOptions<HeadlessPreviewSettings> settings,
            IUmbracoContextAccessor umbracoContextAccessor,
            IPublishedUrlProvider publishedUrlProvider,
            IDictionaryItemService dictionaryItemService,
            ILogger<HeadlessPreviewUrlProvider> logger)
        {
            _settings = settings.Value;
            _umbracoContextAccessor = umbracoContextAccessor;
            _publishedUrlProvider = publishedUrlProvider;
            _dictionaryItemService = dictionaryItemService;
            _logger = logger;
        }

        public string Alias => "HeadlessPreview";

        public UrlInfo? GetUrl(IPublishedContent content, UrlMode mode, string? culture, Uri current)
            => null;

        public IEnumerable<UrlInfo> GetOtherUrls(int id, Uri current)
            => [];

        public async Task<UrlInfo?> GetPreviewUrlAsync(IContent content, string? culture, string? segment)
        {
            if (!IsConfigured())
                return null;

            try
            {
                var contentPath = GetContentPath(content, culture);
                
                if (string.IsNullOrEmpty(contentPath))
                {
                    _logger.LogDebug("Could not determine content path for preview: {Name} ({Culture})", 
                        content.Name, culture);
                    return null;
                }

                var previewUrl = BuildPreviewUrl(contentPath, content.Key, culture);
                var label = await GetLocalizedLabelAsync(culture);

                _logger.LogDebug("Generated headless preview URL for {Name}: {Url}", content.Name, previewUrl);

                return new UrlInfo(
                    url: new Uri(previewUrl),
                    provider: Alias,
                    culture: culture,
                    message: label,
                    isExternal: true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating preview URL for {Name}", content.Name);
                return null;
            }
        }

        private async Task<string> GetLocalizedLabelAsync(string? culture)
        {
            var label = _settings.PreviewLabel;

            if (_settings.UseLocalization && !string.IsNullOrEmpty(label) && label.StartsWith('#'))
            {
                var dictionaryKey = label.TrimStart('#');
                
                try
                {
                    var dictionaryItem = await _dictionaryItemService.GetAsync(dictionaryKey);
                    if (dictionaryItem != null)
                    {
                        var translation = dictionaryItem.Translations
                            .FirstOrDefault(t => string.Equals(t.LanguageIsoCode, culture, StringComparison.OrdinalIgnoreCase));
                        
                        if (translation != null && !string.IsNullOrEmpty(translation.Value))
                            return translation.Value;

                        var fallback = dictionaryItem.Translations.FirstOrDefault(t => !string.IsNullOrEmpty(t.Value));
                        if (fallback != null)
                            return fallback.Value!;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to get dictionary item for key: {Key}", dictionaryKey);
                }
            }

            return label;
        }

        private string? GetContentPath(IContent content, string? culture)
        {
            if (!_umbracoContextAccessor.TryGetUmbracoContext(out var umbracoContext))
                return GetFallbackPath(content, culture);

            var publishedContent = umbracoContext.Content?.GetById(content.Key);
            
            if (publishedContent != null)
            {
                var url = _publishedUrlProvider.GetUrl(publishedContent, UrlMode.Relative, culture);
                if (!string.IsNullOrEmpty(url) && url != "#")
                    return url;
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
