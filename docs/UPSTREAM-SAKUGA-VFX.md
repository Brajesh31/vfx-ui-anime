# 🎴 Upstream Sakuga VFX snapshot

## Source

- **Repository:** https://github.com/finktheartist/sakuga-vfx
- **Author named by the upstream license:** Justin Finkelman
- **Captured revision:** `c3dabb173928a3ad2372183103caf2e6f50953d0`
- **License:** MIT
- **License file retained at:** [`sakuga-vfx/LICENSE`](../sakuga-vfx/LICENSE)

## What is included

The upstream repository snapshot is preserved beneath `sakuga-vfx/` with its original relative directory structure. It includes the live gallery and component demonstrations, all custom element source files, the shared effects core, generated sound-effect artwork, the toggle sprite sheet, component README files, root documentation, registry, agent skill, build/shot/test tools, and deployment configuration.

The root project links to the copied gallery at [`sakuga-vfx/`](../sakuga-vfx/). The upstream code uses the `sakuga-*` custom-element namespace, keeping it separate from this repository's existing `vfx-*` elements.

## Attribution and license

The upstream `LICENSE` file is included unchanged. Its MIT copyright and permission notice must remain with the copied source and substantial portions. The upstream README and component documentation are also retained. Do not remove or replace the original copyright attribution when modifying or redistributing copied upstream files.

The copy is clearly separated from Brajesh Kumar's independently maintained `vfx-*` implementation. Inclusion does not imply endorsement, authorship of the upstream material, or that the upstream artwork was created by this repository's maintainer.

## Maintenance rules

1. Keep upstream files in `sakuga-vfx/` unless a deliberate upstream sync is performed.
2. Do not overwrite or rename the existing `vfx-*` custom elements as part of upstream syncing.
3. Preserve the upstream directory layout because the gallery and component demos use relative script and asset paths.
4. When syncing a newer source revision, record its commit SHA here and review upstream changes before applying them.
5. Test the nested gallery under the repository's GitHub Pages base path after every sync.

## Verification note

The source files were transferred as Git blobs with their original content hashes. This is a source snapshot, not a claim that every upstream interaction has been independently re-tested in this repository's CI environment.
