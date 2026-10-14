---
layout: page
title: Blog Archive
permalink: /archive/
---

Older posts from when this site was a blog. No longer updated.

<ul class="post-list">
  {% for post in site.posts %}
  <li>
    <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
    <h2><a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h2>
  </li>
  {% endfor %}
</ul>
