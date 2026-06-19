---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
You can also find my articles on my [Google Scholar](https://scholar.google.com/citations?user=NAj3cTcAAAAJ&hl) profile

***
## 2026
- Revisiting Weakly-Supervised Video Scene Graph Generation via Pair Affinity Learning  
  <small>Minseok Kang, Minhyeok Lee, Minjung Kim, <strong style="color:#1E293B">Jungho Lee</strong>, Donghyeong Kim, Sungmin Woo, Inseok Jeon, Sangyoun Lee</small>  
  <small>*European Conference on Computer Vision (ECCV), 2026*</small>  
  <small>[[paper](https://arxiv.org/abs/2603.21559)][[code](https://github.com/minseokii/PAWS)]</small>  
  
- SwiftVGGT: A Scalable Visual Geometry Grounded Transformer for Large-Scale Scenes   
  <small><strong style="color:#1E293B">Jungho Lee</strong>, Minhyeok Lee, Sunghun Yang, Minseok Kang, Sangyoun Lee</small>  
  <small>*The IEEE/CVF Computer Vision and Pattern Recognition (CVPR) Findings, 2026*</small>  
  <small>[[paper](https://arxiv.org/abs/2511.18290)][[project page](https://jho-yonsei.github.io/SwiftVGGT/)][[code](https://github.com/Jho-Yonsei/SwiftVGGT)]</small>
  
- MoRGS: Efficient Per-Gaussian Motion Reasoning for Streamable Dynamic 3D Scenes   
  <small>Wonjoon Lee, Sungmin Woo, Donghyeong Kim, <strong style="color:#1E293B">Jungho Lee</strong>, Sangheon Park, Sangyoun Lee</small>  
  <small>*The IEEE/CVF Computer Vision and Pattern Recognition (CVPR), 2026*</small>  
  <small>[[paper](https://arxiv.org/abs/2603.25042)][[code](https://github.com/LeeWonJoon9868/MoRGS)]</small>
  
- Synchronizing Vision and Language: Bidirectional Token-Masking AutoEncoder for Referring Image Segmentation   
  <small>Minhyeok Lee, Dogyoon Lee, <strong style="color:#1E293B">Jungho Lee</strong>, Suhwan Cho, Sangyoun Lee</small>  
  <small>*Pattern Recognition*</small>  
  <small>[[paper](https://arxiv.org/abs/2311.17952)]</small>

- MonoCLUE: Object-Aware Clustering Enhances Monocular 3D Object Detection   
  <small>Sunghun Yang, Minhyeok Lee, <strong style="color:#1E293B">Jungho Lee</strong>, Sangyoun Lee</small>  
  <small>*The Association for the Advancement of Artificial Intelligence (AAAI), 2026*</small>  
  <small>[[paper](https://arxiv.org/abs/2511.07862)][[code](https://github.com/SungHunYang/MonoCLUE)]</small>

## 2025
- Sparse-DeRF: Deblurred Neural Radiance Fields from Sparse View   
  <small>Dogyoon Lee, Donghyeong Kim, <strong style="color:#1E293B">Jungho Lee</strong>, Minhyeok Lee, Seunghoon Lee, Sangyoun Lee</small>  
  <small>*IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)*</small>    
  <small>[[paper](https://arxiv.org/abs/2407.06613)][[project page](https://dogyoonlee.github.io/sparsederf/)]</small>

- CoMoGaussian: Continuous Motion-Aware Gaussian Splatting from Motion-Blurred Images   
  <small><strong style="color:#1E293B">Jungho Lee</strong>, Donghyeong Kim, Dogyoon Lee, Suhwan Cho, Minhyeok Lee, Wonjoon Lee, Taeoh Kim, Dongyoon Wee, Sangyoun Lee</small>  
  <small>*The IEEE/CVF International Conference on Computer Vision (ICCV), 2025*</small>    
  <small>[[paper](https://arxiv.org/abs/2503.05332)][[project page](https://jho-yonsei.github.io/CoMoGaussian/)][[code](https://github.com/Jho-Yonsei/CoMoGaussian)]</small>

- Find First, Track Next: Decoupling Identification and Propagation in Referring Video Object Segmentation   
  <small>Suhwan Cho, Seunghoon Lee, Minhyeok Lee, <strong style="color:#1E293B">Jungho Lee</strong>, Sangyoun Lee</small>  
  <small>*The 7th Large-Scale Object Segmentation (LSVOS) Workshop (ICCVW), 2025*</small>  
  <small>[[paper](https://arxiv.org/abs/2503.03492)][[code](https://github.com/suhwan-cho/FindTrack)]</small>

- DepthFlow: Exploiting Depth-Flow Structural Correlations for Unsupervised Video Object Segmentation   
  <small>Suhwan Cho, Minhyeok Lee, <strong style="color:#1E293B">Jungho Lee</strong>, Donghyeong Kim, Sangyoun Lee</small>  
  <small>*The 7th Large-Scale Object Segmentation (LSVOS) Workshop (ICCVW), 2025*</small>    
  <small>[[paper](https://arxiv.org/abs/2507.19790)][[code](https://github.com/suhwan-cho/DepthFlow)]</small>

- TransFlow: Motion Knowledge Transfer from Video Diffusion Models to Video Salient Object Detection   
  <small>Suhwan Cho, Minhyeok Lee, <strong style="color:#1E293B">Jungho Lee</strong>, Sunghun Yang, Sangyoun Lee</small>  
  <small>*The 7th Large-Scale Object Segmentation (LSVOS) Workshop (ICCVW), 2025*</small>    
  <small>[[paper](https://arxiv.org/abs/2507.19789)][[code](https://github.com/suhwan-cho/TransFlow)]</small>

- GenCLIP: Generalizing CLIP Prompts for Zero-Shot Anomaly Detection   
  <small>Donghyeong Kim, Chaewon Park, Suhwan Cho, Hyeonjeong Lim, Minseok Kang, <strong style="color:#1E293B">Jungho Lee</strong>, Sangyoun Lee</small>  
  <small>*Pattern Recognition, The 3rd Workshop in Vision-based UnduStrial InspectiON (ICCVW), 2025*</small>  
  <small>[[paper](https://arxiv.org/abs/2504.14919)][[code](https://github.com/eastbrother87/GenCLIP)]</small>

- CMTM: Cross-Modal Token Modulation for Unsupervised Video Object Segmentation   
  <small>Inseok Jeon, Suhwan Cho, Minhyeok Lee, Seunghoon Lee, Minseok Kang, <strong style="color:#1E293B">Jungho Lee</strong>, Chaewon Park, Donghyeong Kim, Sangyoun Lee</small>  
  <small>*IEEE International Conference on Image Processing (ICIP), 2025*</small>    
  <small>[[paper](https://arxiv.org/abs/2604.14630)][[code](https://github.com/InSeokJeon/CMTM)]</small>

- CoCoGaussian: Leveraging Circle of Confusion for Gaussian Splatting from Defocused Images   
  <small><strong style="color:#1E293B">Jungho Lee</strong>, Suhwan Cho, Taeoh Kim, Ho-Deok Jang, Minhyeok Lee, Geonho Cha, Dongyoon Wee, Dogyoon Lee, Sangyoun Lee</small>  
  <small>*The IEEE/CVF Computer Vision and Pattern Recognition (CVPR), 2025*</small>    
  <small>[[paper](https://arxiv.org/abs/2412.16028)][[project page](https://jho-yonsei.github.io/CoCoGaussian/)][[code](https://github.com/Jho-Yonsei/CoCoGaussian)]</small>

- Effective SAM Combination for Open-Vocabulary Semantic Segmentation   
  <small>Minhyeok Lee, Suhwan Cho, <strong style="color:#1E293B">Jungho Lee</strong>, Sunghun Yang, Heeseung Choi, Ig-Jae Kim, Sangyoun Lee</small>  
  <small>*🏆 [<strong style="color:#1E293B">Oral</strong>] The IEEE/CVF Computer Vision and Pattern Recognition (CVPR), 2025*</small>    
  <small>[[paper](https://arxiv.org/abs/2411.14723)]</small>

- SMURF: Continuous Dynamics for Motion-Deblurring Radiance Fields   
  <small><strong style="color:#1E293B">Jungho Lee</strong>, Dogyoon Lee, Minhyeok Lee, Donghyeong Kim, Sangyoun Lee</small>  
  <small>*2nd Workshop on Neural Fields Beyond Conventional Cameras (CVPRW), 2025*</small>    
  <small>[[paper](https://arxiv.org/abs/2403.07547)][[project page](https://jho-yonsei.github.io/SMURF/)][[code](https://github.com/Jho-Yonsei/SMURF)]</small>

- Video Diffusion Models are Strong Video Inpainter   
  <small>Minhyeok Lee, Suhwan Cho, Chajin Shin, <strong style="color:#1E293B">Jungho Lee</strong>, Sunghun Yang, Sangyoun Lee</small>  
  <small>*The Association for the Advancement of Artificial Intelligence (AAAI), 2025*</small>    
  <small>[[paper](https://arxiv.org/abs/2408.11402)][[code](https://github.com/Hydragon516/FFF-VDI)]</small>

- Treating Motion as Option with Output Selection for Unsupervised Video Object Segmentation   
  <small>Suhwan Cho, Minhyeok Lee, <strong style="color:#1E293B">Jungho Lee</strong>, Myeongah Cho, Sangyoun Lee</small>  
  <small>*IEEE Transactions on Circuits and Systems for Video Technology (TCSVT)*</small>    
  <small>[[paper](https://arxiv.org/abs/2309.14786)][[code](https://github.com/suhwan-cho/TMO)]</small>

***
## 2024
- Guided Slot Attention for Unsupervised Video Object Segmentation   
  <small>Minhyeok Lee, Dogyoon Lee, Suhwan Cho, Chaewon Park, <strong style="color:#1E293B">Jungho Lee</strong>, Sangyoun Lee</small>  
  <small>*The IEEE/CVF Computer Vision and Pattern Recognition (CVPR), 2024*</small>  
  <small>[[paper](https://arxiv.org/abs/2303.08314)][[code](https://github.com/Hydragon516/GSANet)]</small>

- Multi-Scale Structural Graph Convolutional Network for Skeleton-Based Action Recognition   
  <small>Sungjun Jang, Heansung Lee, Woojin Kim, <strong style="color:#1E293B">Jungho Lee</strong>, Sungmin Woo, Sangyoun Lee</small>  
  <small>*IEEE Transactions on Circuits and Systems for Video Technology (TCSVT)*</small>  
  <small>[[paper](https://ieeexplore.ieee.org/document/10464339)]</small>
  
***
## 2023
- Hierarchically Decomposed Graph Convolutional Networks for Skeleton-Based Action Recognition   
  <small><strong style="color:#1E293B">Jungho Lee</strong>, Minhyeok Lee, Dogyoon Lee, Sangyoun Lee</small>  
  <small>*The IEEE/CVF International Conference on Computer Vision (ICCV), 2023*</small>  
  <small>[[paper](https://arxiv.org/abs/2208.10741)][[code](https://github.com/Jho-Yonsei/HD-GCN)]</small>

- Leveraging Spatio-Temporal Dependency for Skeleton-Based Action Recognition   
  <small><strong style="color:#1E293B">Jungho Lee</strong>, Minhyeok Lee, Suhwan Cho, Sungmin Woo, Sungjun Jang, Sangyoun Lee</small>  
  <small>*The IEEE/CVF International Conference on Computer Vision (ICCV), 2023*</small>  
  <small>[[paper](https://arxiv.org/abs/2212.04761)][[code](https://github.com/Jho-Yonsei/STC-Net/)]</small>

***
## 2022
- Detection-Identification Balancing Margin Loss for One-Stage Multi-Object Tracking   
  <small>Heansung Lee, Suhwan Cho, Sungjun Jang, <strong style="color:#1E293B">Jungho Lee</strong>, Sangyoun Lee</small>  
  <small>*IEEE International Conference on Image Processing (ICIP), 2022*</small>  
  <small>[[paper](https://ieeexplore.ieee.org/document/9898030/)]</small>
