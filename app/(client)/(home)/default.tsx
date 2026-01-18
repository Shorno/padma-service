/**
 * Default fallback for children slot.
 * Required by Next.js parallel routes to handle hard navigation to category URLs.
 * Returns null because the homepage sections should only show at `/`, not at `/[categorySlug]`.
 */
export default function Default() {
    return null;
}
